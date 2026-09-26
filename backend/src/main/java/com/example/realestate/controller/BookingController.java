package com.example.realestate.controller;

import com.example.realestate.dto.request.BookingCreateRequest;
import com.example.realestate.dto.response.BookingResponse;
import com.example.realestate.dto.response.PageResponse;
import com.example.realestate.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Customer Bookings", description = "Property visit requests, status tracking, and cancellation for customers")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    @Operation(summary = "Request a property visit or booking", description = "Creates a visit request with transactional conflict detection against duplicate dates")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingCreateRequest request) {
        BookingResponse response = bookingService.createBooking(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    @Operation(summary = "Get all visit bookings requested by current customer", description = "Returns customer booking history with status badges")
    public ResponseEntity<PageResponse<BookingResponse>> getMyBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(bookingService.getMyBookings(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get booking details by ID", description = "Returns detailed booking request information for authorized customer/agent/admin")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    @Operation(summary = "Cancel a booking request", description = "Cancels a pending or confirmed booking with an optional reason")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            @RequestParam(required = false) String reason
    ) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, reason));
    }
}
