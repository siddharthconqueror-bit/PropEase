package com.example.realestate.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyImageResponse {
    private Long id;
    private String imageUrl;
    private Integer displayOrder;
    private boolean isPrimary;
}
