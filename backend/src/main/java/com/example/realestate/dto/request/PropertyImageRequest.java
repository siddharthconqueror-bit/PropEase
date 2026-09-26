package com.example.realestate.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyImageRequest {

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    private Integer displayOrder;

    private Boolean isPrimary;
}
