package com.example.realestate.controller;

import com.example.realestate.dto.request.BookingStatusUpdateRequest;
import com.example.realestate.dto.response.BookingResponse;
import com.example.realestate.dto.response.PageResponse;
import com.example.realestate.entity.BookingStatus;
import com.example.realestate.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agent/bookings")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
@Tag(name = "Agent Booking Management", description = "Review and respond to customer booking requests for agent-listed properties")
public class AgentBookingController {

    private final BookingService bookingService;

    @GetMapping
    @Operation(summary = "Get booking requests for agent's properties", description = "Returns all customer visit requests submitted for properties listed by the agent")
    public ResponseEntity<PageResponse<BookingResponse>> getAgentBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(bookingService.getAgentBookings(status, pageable));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update booking status (Confirm / Reject / Complete)", description = "Agent accepts or rejects a customer visit request")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable Long id,
            @Valid @RequestBody BookingStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(bookingService.updateBookingStatusByAgent(id, request));
    }

    @PutMapping("/{id}/confirm")
    @Operation(summary = "Convenience endpoint to confirm a booking", description = "Marks a pending booking as CONFIRMED")
    public ResponseEntity<BookingResponse> confirmBooking(@PathVariable Long id) {
        BookingStatusUpdateRequest request = BookingStatusUpdateRequest.builder()
                .status(BookingStatus.CONFIRMED)
                .build();
        return ResponseEntity.ok(bookingService.updateBookingStatusByAgent(id, request));
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Convenience endpoint to reject a booking", description = "Marks a pending booking as REJECTED with a reason")
    public ResponseEntity<BookingResponse> rejectBooking(
            @PathVariable Long id,
            @RequestParam(defaultValue = "Slot not available with builder") String reason
    ) {
        BookingStatusUpdateRequest request = BookingStatusUpdateRequest.builder()
                .status(BookingStatus.REJECTED)
                .reason(reason)
                .build();
        return ResponseEntity.ok(bookingService.updateBookingStatusByAgent(id, request));
    }
}
