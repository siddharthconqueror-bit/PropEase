package com.example.realestate.dto.request;

import com.example.realestate.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    @Size(max = 500, message = "Reason cannot exceed 500 characters")
    private String reason;
}
