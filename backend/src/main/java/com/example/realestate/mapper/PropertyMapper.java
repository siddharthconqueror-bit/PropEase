package com.example.realestate.mapper;

import com.example.realestate.dto.request.PropertyCreateRequest;
import com.example.realestate.dto.request.PropertyUpdateRequest;
import com.example.realestate.dto.response.PropertyImageResponse;
import com.example.realestate.dto.response.PropertyResponse;
import com.example.realestate.entity.FurnishingStatus;
import com.example.realestate.entity.Property;
import com.example.realestate.entity.PropertyImage;
import com.example.realestate.entity.PropertyStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PropertyMapper {

    private final UserMapper userMapper;

    public PropertyResponse toResponse(Property property) {
        if (property == null) {
            return null;
        }

        List<PropertyImageResponse> imageResponses = property.getImages() != null
                ? property.getImages().stream().map(this::toImageResponse).collect(Collectors.toList())
                : new ArrayList<>();

        String primaryImageUrl = null;
        if (property.getImages() != null && !property.getImages().isEmpty()) {
            primaryImageUrl = property.getImages().stream()
                    .filter(PropertyImage::isPrimary)
                    .map(PropertyImage::getImageUrl)
                    .findFirst()
                    .orElse(property.getImages().get(0).getImageUrl());
        }

        return PropertyResponse.builder()
                .id(property.getId())
                .title(property.getTitle())
                .description(property.getDescription())
                .price(property.getPrice())
                .location(property.getLocation())
                .city(property.getCity())
                .state(property.getState())
                .postalCode(property.getPostalCode())
                .propertyType(property.getPropertyType())
                .status(property.getStatus())
                .bedrooms(property.getBedrooms())
                .bathrooms(property.getBathrooms())
                .balconies(property.getBalconies())
                .areaSqft(property.getAreaSqft())
                .parkingAvailable(property.isParkingAvailable())
                .furnishingStatus(property.getFurnishingStatus())
                .yearBuilt(property.getYearBuilt())
                .latitude(property.getLatitude())
                .longitude(property.getLongitude())
                .featured(property.isFeatured())
                .agent(userMapper.toResponse(property.getAgent()))
                .primaryImageUrl(primaryImageUrl)
                .images(imageResponses)
                .createdAt(property.getCreatedAt())
                .updatedAt(property.getUpdatedAt())
                .build();
    }

    public PropertyImageResponse toImageResponse(PropertyImage image) {
        if (image == null) {
            return null;
        }
        return PropertyImageResponse.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .displayOrder(image.getDisplayOrder())
                .isPrimary(image.isPrimary())
                .build();
    }

    public Property toEntity(PropertyCreateRequest request) {
        if (request == null) {
            return null;
        }
        return Property.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .location(request.getLocation())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .propertyType(request.getPropertyType())
                .status(PropertyStatus.AVAILABLE)
                .bedrooms(request.getBedrooms())
                .bathrooms(request.getBathrooms())
                .balconies(request.getBalconies())
                .areaSqft(request.getAreaSqft())
                .parkingAvailable(request.getParkingAvailable() != null ? request.getParkingAvailable() : false)
                .furnishingStatus(request.getFurnishingStatus() != null ? request.getFurnishingStatus() : FurnishingStatus.UNFURNISHED)
                .yearBuilt(request.getYearBuilt())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .build();
    }

    public void updateEntity(Property property, PropertyUpdateRequest request) {
        if (property == null || request == null) {
            return;
        }
        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setPrice(request.getPrice());
        property.setLocation(request.getLocation());
        property.setCity(request.getCity());
        property.setState(request.getState());
        property.setPostalCode(request.getPostalCode());
        property.setPropertyType(request.getPropertyType());
        if (request.getStatus() != null) {
            property.setStatus(request.getStatus());
        }
        property.setBedrooms(request.getBedrooms());
        property.setBathrooms(request.getBathrooms());
        property.setBalconies(request.getBalconies());
        property.setAreaSqft(request.getAreaSqft());
        if (request.getParkingAvailable() != null) {
            property.setParkingAvailable(request.getParkingAvailable());
        }
        if (request.getFurnishingStatus() != null) {
            property.setFurnishingStatus(request.getFurnishingStatus());
        }
        property.setYearBuilt(request.getYearBuilt());
        property.setLatitude(request.getLatitude());
        property.setLongitude(request.getLongitude());
        if (request.getFeatured() != null) {
            property.setFeatured(request.getFeatured());
        }
    }
}
