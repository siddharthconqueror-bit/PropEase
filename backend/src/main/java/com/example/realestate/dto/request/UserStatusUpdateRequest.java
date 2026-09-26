package com.example.realestate.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatusUpdateRequest {

    @NotNull(message = "Active status flag is required")
    private Boolean active;
}
