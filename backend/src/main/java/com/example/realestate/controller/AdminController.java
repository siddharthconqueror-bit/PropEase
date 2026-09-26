package com.example.realestate.controller;

import com.example.realestate.dto.request.PropertySearchCriteria;
import com.example.realestate.dto.request.UserStatusUpdateRequest;
import com.example.realestate.dto.response.BookingResponse;
import com.example.realestate.dto.response.DashboardStatsResponse;
import com.example.realestate.dto.response.PageResponse;
import com.example.realestate.dto.response.PropertyResponse;
import com.example.realestate.dto.response.UserResponse;
import com.example.realestate.entity.Role;
import com.example.realestate.service.AdminService;
import com.example.realestate.service.BookingService;
import com.example.realestate.service.PropertyService;
import com.example.realestate.service.UserService;
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
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administration", description = "System-wide governance over users, agents, properties, and analytics")
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;
    private final PropertyService propertyService;
    private final BookingService bookingService;

    @GetMapping("/stats")
    @Operation(summary = "Get system analytics and summary counts", description = "Returns aggregate counts for users, agents, properties, and bookings")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users across the system", description = "Paginated list of all customers, agents, and administrators")
    public ResponseEntity<PageResponse<UserResponse>> getAllUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(userService.getAllUsers(role, pageable));
    }

    @PutMapping("/users/{id}/status")
    @Operation(summary = "Activate or deactivate a user account", description = "Allows administrators to enable/disable any user or agent")
    public ResponseEntity<UserResponse> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UserStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(userService.updateUserStatus(id, request));
    }

    @GetMapping("/properties")
    @Operation(summary = "Get all properties (All statuses)", description = "Allows admins to view all active, sold, booked, and inactive properties")
    public ResponseEntity<PageResponse<PropertyResponse>> getAllProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        PropertySearchCriteria criteria = new PropertySearchCriteria(); // No status filter = all properties
        return ResponseEntity.ok(propertyService.searchProperties(criteria, pageable));
    }

    @GetMapping("/bookings")
    @Operation(summary = "Get all bookings across the platform", description = "Allows admins to monitor all customer visit bookings")
    public ResponseEntity<PageResponse<BookingResponse>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(bookingService.getAllBookingsAdmin(pageable));
    }
}
