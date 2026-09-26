package com.example.realestate.service;

import com.example.realestate.dto.request.BookingCreateRequest;
import com.example.realestate.dto.response.BookingResponse;
import com.example.realestate.entity.*;
import com.example.realestate.exception.BookingConflictException;
import com.example.realestate.exception.InvalidBookingException;
import com.example.realestate.mapper.BookingMapper;
import com.example.realestate.repository.BookingRepository;
import com.example.realestate.repository.PropertyRepository;
import com.example.realestate.repository.UserRepository;
import com.example.realestate.security.UserDetailsImpl;
import com.example.realestate.service.impl.BookingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BookingMapper bookingMapper;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private User customer;
    private User agent;
    private Property property;

    @BeforeEach
    void setUp() {
        customer = User.builder()
                .id(1L)
                .name("Customer User")
                .email("customer@propease.in")
                .role(Role.CUSTOMER)
                .active(true)
                .build();

        agent = User.builder()
                .id(2L)
                .name("Agent User")
                .email("agent@propease.in")
                .role(Role.AGENT)
                .active(true)
                .build();

        property = Property.builder()
                .id(100L)
                .title("OMR Chennai 3 BHK")
                .price(new BigDecimal("8500000.00"))
                .location("OMR Sholinganallur")
                .city("Chennai")
                .state("Tamil Nadu")
                .propertyType(PropertyType.APARTMENT)
                .status(PropertyStatus.AVAILABLE)
                .areaSqft(1500.0)
                .agent(agent)
                .build();

        UserDetailsImpl userDetails = UserDetailsImpl.build(customer);
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void createBooking_Success() {
        BookingCreateRequest request = BookingCreateRequest.builder()
                .propertyId(100L)
                .bookingDate(LocalDate.now().plusDays(3))
                .preferredTime("11:00 AM")
                .purpose("Site Visit")
                .customerMessage("Need site tour")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(propertyRepository.findById(100L)).thenReturn(Optional.of(property));
        when(bookingRepository.findConflictingBookings(eq(100L), any(LocalDate.class), anyList()))
                .thenReturn(Collections.emptyList());

        Booking savedBooking = Booking.builder()
                .id(10L)
                .property(property)
                .customer(customer)
                .bookingDate(request.getBookingDate())
                .status(BookingStatus.PENDING)
                .build();

        BookingResponse response = BookingResponse.builder()
                .id(10L)
                .propertyId(100L)
                .propertyTitle(property.getTitle())
                .status(BookingStatus.PENDING)
                .build();

        when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);
        when(bookingMapper.toResponse(savedBooking)).thenReturn(response);

        BookingResponse result = bookingService.createBooking(request);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals(BookingStatus.PENDING, result.getStatus());
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    void createBooking_ThrowsBookingConflictException() {
        BookingCreateRequest request = BookingCreateRequest.builder()
                .propertyId(100L)
                .bookingDate(LocalDate.now().plusDays(3))
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(propertyRepository.findById(100L)).thenReturn(Optional.of(property));

        Booking existingBooking = Booking.builder().id(5L).status(BookingStatus.CONFIRMED).build();
        when(bookingRepository.findConflictingBookings(eq(100L), any(LocalDate.class), anyList()))
                .thenReturn(List.of(existingBooking));

        assertThrows(BookingConflictException.class, () -> bookingService.createBooking(request));
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    void createBooking_ThrowsWhenPropertyNotAvailable() {
        property.setStatus(PropertyStatus.SOLD);

        BookingCreateRequest request = BookingCreateRequest.builder()
                .propertyId(100L)
                .bookingDate(LocalDate.now().plusDays(3))
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(propertyRepository.findById(100L)).thenReturn(Optional.of(property));

        assertThrows(InvalidBookingException.class, () -> bookingService.createBooking(request));
        verify(bookingRepository, never()).save(any(Booking.class));
    }
}
