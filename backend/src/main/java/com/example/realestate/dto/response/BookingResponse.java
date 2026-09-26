package com.example.realestate.dto.response;

import com.example.realestate.entity.BookingStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private String propertyLocation;
    private String propertyCity;
    private String propertyImageUrl;
    private UserResponse customer;
    private UserResponse agent;
    private LocalDate bookingDate;
    private String preferredTime;
    private String purpose;
    private String customerMessage;
    private BookingStatus status;
    private String cancellationReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
