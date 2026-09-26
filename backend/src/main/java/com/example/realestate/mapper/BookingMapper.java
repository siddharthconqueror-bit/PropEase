package com.example.realestate.mapper;

import com.example.realestate.dto.response.BookingResponse;
import com.example.realestate.entity.Booking;
import com.example.realestate.entity.PropertyImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingMapper {

    private final UserMapper userMapper;

    public BookingResponse toResponse(Booking booking) {
        if (booking == null) {
            return null;
        }

        String propertyImageUrl = null;
        if (booking.getProperty() != null && booking.getProperty().getImages() != null && !booking.getProperty().getImages().isEmpty()) {
            propertyImageUrl = booking.getProperty().getImages().stream()
                    .filter(PropertyImage::isPrimary)
                    .map(PropertyImage::getImageUrl)
                    .findFirst()
                    .orElse(booking.getProperty().getImages().get(0).getImageUrl());
        }

        return BookingResponse.builder()
                .id(booking.getId())
                .propertyId(booking.getProperty() != null ? booking.getProperty().getId() : null)
                .propertyTitle(booking.getProperty() != null ? booking.getProperty().getTitle() : null)
                .propertyLocation(booking.getProperty() != null ? booking.getProperty().getLocation() : null)
                .propertyCity(booking.getProperty() != null ? booking.getProperty().getCity() : null)
                .propertyImageUrl(propertyImageUrl)
                .customer(userMapper.toResponse(booking.getCustomer()))
                .agent(booking.getProperty() != null ? userMapper.toResponse(booking.getProperty().getAgent()) : null)
                .bookingDate(booking.getBookingDate())
                .preferredTime(booking.getPreferredTime())
                .purpose(booking.getPurpose())
                .customerMessage(booking.getCustomerMessage())
                .status(booking.getStatus())
                .cancellationReason(booking.getCancellationReason())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}
