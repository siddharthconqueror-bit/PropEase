package com.example.realestate.controller;

import com.example.realestate.dto.request.PropertyCreateRequest;
import com.example.realestate.dto.request.PropertyImageRequest;
import com.example.realestate.dto.request.PropertySearchCriteria;
import com.example.realestate.dto.request.PropertyUpdateRequest;
import com.example.realestate.dto.response.PageResponse;
import com.example.realestate.dto.response.PropertyResponse;
import com.example.realestate.entity.FurnishingStatus;
import com.example.realestate.entity.PropertyStatus;
import com.example.realestate.entity.PropertyType;
import com.example.realestate.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@Tag(name = "Properties", description = "Public property browsing, dynamic search, and agent property management")
public class PropertyController {

    private final PropertyService propertyService;

    @GetMapping
    @Operation(summary = "Get all available properties (Paginated)", description = "Fetches active and available properties with pagination and sorting")
    public ResponseEntity<PageResponse<PropertyResponse>> getAllProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        PropertySearchCriteria criteria = PropertySearchCriteria.builder()
                .status(PropertyStatus.AVAILABLE)
                .build();
        return ResponseEntity.ok(propertyService.searchProperties(criteria, pageable));
    }

    @GetMapping("/search")
    @Operation(summary = "Dynamic property search and filtering", description = "Search properties with location, city, price range, bedrooms, area, furnishing, and property type filters")
    public ResponseEntity<PageResponse<PropertyResponse>> searchProperties(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) PropertyType propertyType,
            @RequestParam(required = false) Integer minBedrooms,
            @RequestParam(required = false) Integer maxBedrooms,
            @RequestParam(required = false) Double minArea,
            @RequestParam(required = false) Double maxArea,
            @RequestParam(required = false) FurnishingStatus furnishingStatus,
            @RequestParam(required = false) Boolean parkingAvailable,
            @RequestParam(required = false) PropertyStatus status,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Long agentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PropertySearchCriteria criteria = PropertySearchCriteria.builder()
                .query(query)
                .location(location)
                .city(city)
                .state(state)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .propertyType(propertyType)
                .minBedrooms(minBedrooms)
                .maxBedrooms(maxBedrooms)
                .minArea(minArea)
                .maxArea(maxArea)
                .furnishingStatus(furnishingStatus)
                .parkingAvailable(parkingAvailable)
                .status(status != null ? status : PropertyStatus.AVAILABLE)
                .featured(featured)
                .agentId(agentId)
                .build();

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(propertyService.searchProperties(criteria, pageable));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured properties", description = "Returns prime hand-picked featured properties for homepage banners")
    public ResponseEntity<List<PropertyResponse>> getFeaturedProperties() {
        return ResponseEntity.ok(propertyService.getFeaturedProperties());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get complete property details by ID", description = "Returns comprehensive property data including images, specifications, and agent card")
    public ResponseEntity<PropertyResponse> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    @GetMapping("/agent/my")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    @Operation(summary = "Get properties listed by authenticated agent", description = "Returns all properties created by the logged-in agent")
    public ResponseEntity<PageResponse<PropertyResponse>> getAgentProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(propertyService.getAgentProperties(pageable));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    @Operation(summary = "Create a new property listing", description = "Creates a new property listing associated with the authenticated agent")
    public ResponseEntity<PropertyResponse> createProperty(@Valid @RequestBody PropertyCreateRequest request) {
        PropertyResponse response = propertyService.createProperty(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    @Operation(summary = "Update an existing property listing", description = "Updates property information. Only property owner agent or admin is authorized")
    public ResponseEntity<PropertyResponse> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyUpdateRequest request
    ) {
        PropertyResponse response = propertyService.updateProperty(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    @Operation(summary = "Delete property listing (Soft Delete)", description = "Sets property status to INACTIVE. Only owner agent or admin can delete")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/images")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    @Operation(summary = "Add image gallery to property", description = "Appends photo URLs to the property's image gallery")
    public ResponseEntity<PropertyResponse> addPropertyImages(
            @PathVariable Long id,
            @RequestBody List<PropertyImageRequest> images
    ) {
        PropertyResponse response = propertyService.addPropertyImages(id, images);
        return ResponseEntity.ok(response);
    }
}
