package com.example.realestate.dto.request;

import com.example.realestate.entity.FurnishingStatus;
import com.example.realestate.entity.PropertyType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyCreateRequest {

    @NotBlank(message = "Property title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private BigDecimal price;

    @NotBlank(message = "Location address is required")
    private String location;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    private String postalCode;

    @NotNull(message = "Property type is required")
    private PropertyType propertyType;

    @Min(value = 0, message = "Bedrooms cannot be negative")
    private Integer bedrooms;

    @Min(value = 0, message = "Bathrooms cannot be negative")
    private Integer bathrooms;

    @Min(value = 0, message = "Balconies cannot be negative")
    private Integer balconies;

    @NotNull(message = "Area in square feet is required")
    @Positive(message = "Area must be greater than zero")
    private Double areaSqft;

    private Boolean parkingAvailable;

    private FurnishingStatus furnishingStatus;

    @Min(value = 1800, message = "Year built must be realistic")
    private Integer yearBuilt;

    private Double latitude;
    private Double longitude;

    private Boolean featured;

    private List<PropertyImageRequest> images;
}
