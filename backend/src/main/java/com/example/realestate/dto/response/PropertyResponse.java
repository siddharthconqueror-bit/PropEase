package com.example.realestate.dto.response;

import com.example.realestate.entity.FurnishingStatus;
import com.example.realestate.entity.PropertyStatus;
import com.example.realestate.entity.PropertyType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String location;
    private String city;
    private String state;
    private String postalCode;
    private PropertyType propertyType;
    private PropertyStatus status;
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer balconies;
    private Double areaSqft;
    private boolean parkingAvailable;
    private FurnishingStatus furnishingStatus;
    private Integer yearBuilt;
    private Double latitude;
    private Double longitude;
    private boolean featured;
    private UserResponse agent;
    private String primaryImageUrl;
    private List<PropertyImageResponse> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
