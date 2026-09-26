package com.example.realestate.repository;

import com.example.realestate.entity.Property;
import com.example.realestate.entity.PropertyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {

    Page<Property> findByAgentId(Long agentId, Pageable pageable);

    Page<Property> findByAgentIdAndStatus(Long agentId, PropertyStatus status, Pageable pageable);

    List<Property> findByFeaturedTrueAndStatus(PropertyStatus status);

    long countByStatus(PropertyStatus status);

    long countByAgentId(Long agentId);

    long countByAgentIdAndStatus(Long agentId, PropertyStatus status);
}
