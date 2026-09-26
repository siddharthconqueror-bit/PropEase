package com.example.realestate.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "properties", indexes = {
    @Index(name = "idx_prop_city", columnList = "city"),
    @Index(name = "idx_prop_price", columnList = "price"),
    @Index(name = "idx_prop_type", columnList = "property_type"),
    @Index(name = "idx_prop_status", columnList = "status"),
    @Index(name = "idx_prop_agent", columnList = "agent_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_type", nullable = false, length = 30)
    private PropertyType propertyType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PropertyStatus status = PropertyStatus.AVAILABLE;

    @Column(name = "bedrooms")
    private Integer bedrooms;

    @Column(name = "bathrooms")
    private Integer bathrooms;

    @Column(name = "balconies")
    private Integer balconies;

    @Column(name = "area_sqft", nullable = false)
    private Double areaSqft;

    @Column(name = "parking_available")
    @Builder.Default
    private boolean parkingAvailable = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "furnishing_status", length = 30)
    @Builder.Default
    private FurnishingStatus furnishingStatus = FurnishingStatus.UNFURNISHED;

    @Column(name = "year_built")
    private Integer yearBuilt;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "featured", nullable = false)
    @Builder.Default
    private boolean featured = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private User agent;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<PropertyImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Booking> bookings = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public void addImage(PropertyImage image) {
        images.add(image);
        image.setProperty(this);
    }

    public void removeImage(PropertyImage image) {
        images.remove(image);
        image.setProperty(null);
    }
}
