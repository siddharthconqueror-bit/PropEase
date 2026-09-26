package com.example.realestate.dto.request;

import com.example.realestate.entity.FurnishingStatus;
import com.example.realestate.entity.PropertyStatus;
import com.example.realestate.entity.PropertyType;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertySearchCriteria {
    private String query;
    private String location;
    private String city;
    private String state;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private PropertyType propertyType;
    private Integer minBedrooms;
    private Integer maxBedrooms;
    private Double minArea;
    private Double maxArea;
    private FurnishingStatus furnishingStatus;
    private Boolean parkingAvailable;
    private PropertyStatus status;
    private Boolean featured;
    private Long agentId;
}
