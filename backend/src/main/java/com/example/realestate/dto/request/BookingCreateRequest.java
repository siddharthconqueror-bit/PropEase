package com.example.realestate.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingCreateRequest {

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    @NotNull(message = "Booking date is required")
    @FutureOrPresent(message = "Booking date must be today or in the future")
    private LocalDate bookingDate;

    @Size(max = 30, message = "Preferred time string cannot exceed 30 characters")
    private String preferredTime;

    @Size(max = 100, message = "Purpose cannot exceed 100 characters")
    private String purpose;

    @Size(max = 1000, message = "Message cannot exceed 1000 characters")
    private String customerMessage;
}
