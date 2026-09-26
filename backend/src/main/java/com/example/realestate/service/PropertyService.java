package com.example.realestate.service;

import com.example.realestate.dto.request.PropertyCreateRequest;
import com.example.realestate.dto.request.PropertyImageRequest;
import com.example.realestate.dto.request.PropertySearchCriteria;
import com.example.realestate.dto.request.PropertyUpdateRequest;
import com.example.realestate.dto.response.PageResponse;
import com.example.realestate.dto.response.PropertyResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PropertyService {
    PropertyResponse createProperty(PropertyCreateRequest request);
    PropertyResponse getPropertyById(Long id);
    PageResponse<PropertyResponse> searchProperties(PropertySearchCriteria criteria, Pageable pageable);
    List<PropertyResponse> getFeaturedProperties();
    PageResponse<PropertyResponse> getAgentProperties(Pageable pageable);
    PropertyResponse updateProperty(Long id, PropertyUpdateRequest request);
    void deleteProperty(Long id);
    PropertyResponse addPropertyImages(Long propertyId, List<PropertyImageRequest> images);
}
