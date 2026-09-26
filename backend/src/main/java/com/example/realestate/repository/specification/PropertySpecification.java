package com.example.realestate.repository.specification;

import com.example.realestate.dto.request.PropertySearchCriteria;
import com.example.realestate.entity.Property;
import com.example.realestate.entity.PropertyStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class PropertySpecification {

    public static Specification<Property> buildSpecification(PropertySearchCriteria criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (criteria == null) {
                predicates.add(cb.equal(root.get("status"), PropertyStatus.AVAILABLE));
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            // General text search
            if (StringUtils.hasText(criteria.getQuery())) {
                String searchPattern = "%" + criteria.getQuery().toLowerCase() + "%";
                Predicate titlePredicate = cb.like(cb.lower(root.get("title")), searchPattern);
                Predicate descPredicate = cb.like(cb.lower(root.get("description")), searchPattern);
                Predicate locPredicate = cb.like(cb.lower(root.get("location")), searchPattern);
                Predicate cityPredicate = cb.like(cb.lower(root.get("city")), searchPattern);
                predicates.add(cb.or(titlePredicate, descPredicate, locPredicate, cityPredicate));
            }

            // Location
            if (StringUtils.hasText(criteria.getLocation())) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + criteria.getLocation().toLowerCase() + "%"));
            }

            // City
            if (StringUtils.hasText(criteria.getCity()) && !criteria.getCity().equalsIgnoreCase("All") && !criteria.getCity().equalsIgnoreCase("All Tamil Nadu")) {
                predicates.add(cb.equal(cb.lower(root.get("city")), criteria.getCity().toLowerCase()));
            }

            // State
            if (StringUtils.hasText(criteria.getState())) {
                predicates.add(cb.equal(cb.lower(root.get("state")), criteria.getState().toLowerCase()));
            }

            // Price range
            if (criteria.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), criteria.getMinPrice()));
            }
            if (criteria.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), criteria.getMaxPrice()));
            }

            // Property Type
            if (criteria.getPropertyType() != null) {
                predicates.add(cb.equal(root.get("propertyType"), criteria.getPropertyType()));
            }

            // Bedrooms
            if (criteria.getMinBedrooms() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("bedrooms"), criteria.getMinBedrooms()));
            }
            if (criteria.getMaxBedrooms() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("bedrooms"), criteria.getMaxBedrooms()));
            }

            // Area
            if (criteria.getMinArea() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("areaSqft"), criteria.getMinArea()));
            }
            if (criteria.getMaxArea() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("areaSqft"), criteria.getMaxArea()));
            }

            // Furnishing
            if (criteria.getFurnishingStatus() != null) {
                predicates.add(cb.equal(root.get("furnishingStatus"), criteria.getFurnishingStatus()));
            }

            // Parking
            if (criteria.getParkingAvailable() != null) {
                predicates.add(cb.equal(root.get("parkingAvailable"), criteria.getParkingAvailable()));
            }

            // Status (default to AVAILABLE for normal search if not specified)
            if (criteria.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), criteria.getStatus()));
            } else {
                predicates.add(cb.equal(root.get("status"), PropertyStatus.AVAILABLE));
            }

            // Featured
            if (criteria.getFeatured() != null) {
                predicates.add(cb.equal(root.get("featured"), criteria.getFeatured()));
            }

            // Agent ID
            if (criteria.getAgentId() != null) {
                predicates.add(cb.equal(root.get("agent").get("id"), criteria.getAgentId()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
