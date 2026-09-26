package com.example.realestate.service.impl;

import com.example.realestate.dto.request.PropertyCreateRequest;
import com.example.realestate.dto.request.PropertyImageRequest;
import com.example.realestate.dto.request.PropertySearchCriteria;
import com.example.realestate.dto.request.PropertyUpdateRequest;
import com.example.realestate.dto.response.PageResponse;
import com.example.realestate.dto.response.PropertyResponse;
import com.example.realestate.entity.*;
import com.example.realestate.exception.ResourceNotFoundException;
import com.example.realestate.exception.UnauthorizedOperationException;
import com.example.realestate.mapper.PropertyMapper;
import com.example.realestate.repository.PropertyImageRepository;
import com.example.realestate.repository.PropertyRepository;
import com.example.realestate.repository.UserRepository;
import com.example.realestate.repository.specification.PropertySpecification;
import com.example.realestate.security.UserDetailsImpl;
import com.example.realestate.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final UserRepository userRepository;
    private final PropertyMapper propertyMapper;

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedOperationException("Authentication required");
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userDetails.getId()));
    }

    @Override
    @Transactional
    public PropertyResponse createProperty(PropertyCreateRequest request) {
        User agent = getAuthenticatedUser();

        Property property = propertyMapper.toEntity(request);
        property.setAgent(agent);

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            for (int i = 0; i < request.getImages().size(); i++) {
                PropertyImageRequest imgReq = request.getImages().get(i);
                PropertyImage image = PropertyImage.builder()
                        .imageUrl(imgReq.getImageUrl())
                        .displayOrder(imgReq.getDisplayOrder() != null ? imgReq.getDisplayOrder() : i)
                        .isPrimary(imgReq.getIsPrimary() != null ? imgReq.getIsPrimary() : (i == 0))
                        .property(property)
                        .build();
                property.addImage(image);
            }
        }

        Property saved = propertyRepository.save(property);
        return propertyMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PropertyResponse getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + id));
        return propertyMapper.toResponse(property);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PropertyResponse> searchProperties(PropertySearchCriteria criteria, Pageable pageable) {
        Specification<Property> spec = PropertySpecification.buildSpecification(criteria);
        Page<Property> propertyPage = propertyRepository.findAll(spec, pageable);
        return PageResponse.from(propertyPage.map(propertyMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropertyResponse> getFeaturedProperties() {
        List<Property> featuredList = propertyRepository.findByFeaturedTrueAndStatus(PropertyStatus.AVAILABLE);
        return featuredList.stream().map(propertyMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PropertyResponse> getAgentProperties(Pageable pageable) {
        User agent = getAuthenticatedUser();
        Page<Property> propertyPage = propertyRepository.findByAgentId(agent.getId(), pageable);
        return PageResponse.from(propertyPage.map(propertyMapper::toResponse));
    }

    @Override
    @Transactional
    public PropertyResponse updateProperty(Long id, PropertyUpdateRequest request) {
        User currentUser = getAuthenticatedUser();
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + id));

        // Authorization check: Only property owner agent or ADMIN can update
        if (currentUser.getRole() != Role.ADMIN && !property.getAgent().getId().equals(currentUser.getId())) {
            throw new UnauthorizedOperationException("You can only update your own properties");
        }

        propertyMapper.updateEntity(property, request);

        if (request.getImages() != null) {
            property.getImages().clear();
            for (int i = 0; i < request.getImages().size(); i++) {
                PropertyImageRequest imgReq = request.getImages().get(i);
                PropertyImage image = PropertyImage.builder()
                        .imageUrl(imgReq.getImageUrl())
                        .displayOrder(imgReq.getDisplayOrder() != null ? imgReq.getDisplayOrder() : i)
                        .isPrimary(imgReq.getIsPrimary() != null ? imgReq.getIsPrimary() : (i == 0))
                        .property(property)
                        .build();
                property.addImage(image);
            }
        }

        Property updated = propertyRepository.save(property);
        return propertyMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteProperty(Long id) {
        User currentUser = getAuthenticatedUser();
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + id));

        if (currentUser.getRole() != Role.ADMIN && !property.getAgent().getId().equals(currentUser.getId())) {
            throw new UnauthorizedOperationException("You can only delete your own properties");
        }

        // Soft delete: Set status to INACTIVE
        property.setStatus(PropertyStatus.INACTIVE);
        propertyRepository.save(property);
    }

    @Override
    @Transactional
    public PropertyResponse addPropertyImages(Long propertyId, List<PropertyImageRequest> images) {
        User currentUser = getAuthenticatedUser();
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + propertyId));

        if (currentUser.getRole() != Role.ADMIN && !property.getAgent().getId().equals(currentUser.getId())) {
            throw new UnauthorizedOperationException("You can only manage images for your own properties");
        }

        if (images != null) {
            for (PropertyImageRequest req : images) {
                PropertyImage image = PropertyImage.builder()
                        .imageUrl(req.getImageUrl())
                        .displayOrder(req.getDisplayOrder() != null ? req.getDisplayOrder() : property.getImages().size())
                        .isPrimary(req.getIsPrimary() != null ? req.getIsPrimary() : false)
                        .property(property)
                        .build();
                property.addImage(image);
            }
        }

        Property saved = propertyRepository.save(property);
        return propertyMapper.toResponse(saved);
    }
}
