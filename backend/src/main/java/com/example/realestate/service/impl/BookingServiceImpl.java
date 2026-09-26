package com.example.realestate.service.impl;

import com.example.realestate.dto.request.BookingCreateRequest;
import com.example.realestate.dto.request.BookingStatusUpdateRequest;
import com.example.realestate.dto.response.BookingResponse;
import com.example.realestate.dto.response.PageResponse;
import com.example.realestate.entity.*;
import com.example.realestate.exception.BookingConflictException;
import com.example.realestate.exception.InvalidBookingException;
import com.example.realestate.exception.ResourceNotFoundException;
import com.example.realestate.exception.UnauthorizedOperationException;
import com.example.realestate.mapper.BookingMapper;
import com.example.realestate.repository.BookingRepository;
import com.example.realestate.repository.PropertyRepository;
import com.example.realestate.repository.UserRepository;
import com.example.realestate.security.UserDetailsImpl;
import com.example.realestate.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final BookingMapper bookingMapper;

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedOperationException("Authentication required");
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userDetails.getId()));
    }

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public BookingResponse createBooking(BookingCreateRequest request) {
        User customer = getAuthenticatedUser();

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + request.getPropertyId()));

        if (property.getStatus() != PropertyStatus.AVAILABLE) {
            throw new InvalidBookingException("This property is currently not available for bookings/visits. Current status: " + property.getStatus());
        }

        // Check for duplicate/conflicting active booking for same property and date
        List<BookingStatus> activeStatuses = Arrays.asList(BookingStatus.PENDING, BookingStatus.CONFIRMED);
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                property.getId(),
                request.getBookingDate(),
                activeStatuses
        );

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("A visit/booking request already exists for this property on " + request.getBookingDate() + ". Please select another date.");
        }

        Booking booking = Booking.builder()
                .property(property)
                .customer(customer)
                .bookingDate(request.getBookingDate())
                .preferredTime(request.getPreferredTime())
                .purpose(request.getPurpose() != null ? request.getPurpose() : "Site Visit & Document Verification")
                .customerMessage(request.getCustomerMessage())
                .status(BookingStatus.PENDING)
                .build();

        Booking saved = bookingRepository.save(booking);
        return bookingMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id) {
        User currentUser = getAuthenticatedUser();
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        // Authorization check: Customer, Agent of property, or Admin
        boolean isOwnerCustomer = booking.getCustomer().getId().equals(currentUser.getId());
        boolean isPropertyAgent = booking.getProperty().getAgent().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isOwnerCustomer && !isPropertyAgent && !isAdmin) {
            throw new UnauthorizedOperationException("You do not have permission to view this booking");
        }

        return bookingMapper.toResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<BookingResponse> getMyBookings(Pageable pageable) {
        User customer = getAuthenticatedUser();
        Page<Booking> bookingPage = bookingRepository.findByCustomerId(customer.getId(), pageable);
        return PageResponse.from(bookingPage.map(bookingMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<BookingResponse> getAgentBookings(BookingStatus status, Pageable pageable) {
        User agent = getAuthenticatedUser();
        Page<Booking> bookingPage;
        if (status != null) {
            bookingPage = bookingRepository.findByPropertyAgentIdAndStatus(agent.getId(), status, pageable);
        } else {
            bookingPage = bookingRepository.findByPropertyAgentId(agent.getId(), pageable);
        }
        return PageResponse.from(bookingPage.map(bookingMapper::toResponse));
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long id, String reason) {
        User currentUser = getAuthenticatedUser();
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        boolean isCustomer = booking.getCustomer().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isCustomer && !isAdmin) {
            throw new UnauthorizedOperationException("Only the booking customer or admin can cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.REJECTED) {
            throw new InvalidBookingException("Booking is already " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason != null ? reason : "Cancelled by user");
        Booking updated = bookingRepository.save(booking);

        return bookingMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public BookingResponse updateBookingStatusByAgent(Long id, BookingStatusUpdateRequest request) {
        User agent = getAuthenticatedUser();
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        boolean isAgent = booking.getProperty().getAgent().getId().equals(agent.getId());
        boolean isAdmin = agent.getRole() == Role.ADMIN;

        if (!isAgent && !isAdmin) {
            throw new UnauthorizedOperationException("You can only manage bookings for your own properties");
        }

        booking.setStatus(request.getStatus());
        if (request.getReason() != null) {
            booking.setCancellationReason(request.getReason());
        }

        Booking updated = bookingRepository.save(booking);
        return bookingMapper.toResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<BookingResponse> getAllBookingsAdmin(Pageable pageable) {
        Page<Booking> bookingPage = bookingRepository.findAll(pageable);
        return PageResponse.from(bookingPage.map(bookingMapper::toResponse));
    }
}
