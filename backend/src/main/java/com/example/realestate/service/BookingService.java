package com.example.realestate.service;

import com.example.realestate.dto.request.BookingCreateRequest;
import com.example.realestate.dto.request.BookingStatusUpdateRequest;
import com.example.realestate.dto.response.BookingResponse;
import com.example.realestate.dto.response.PageResponse;
import com.example.realestate.entity.BookingStatus;
import org.springframework.data.domain.Pageable;

public interface BookingService {
    BookingResponse createBooking(BookingCreateRequest request);
    BookingResponse getBookingById(Long id);
    PageResponse<BookingResponse> getMyBookings(Pageable pageable);
    PageResponse<BookingResponse> getAgentBookings(BookingStatus status, Pageable pageable);
    BookingResponse cancelBooking(Long id, String reason);
    BookingResponse updateBookingStatusByAgent(Long id, BookingStatusUpdateRequest request);
    PageResponse<BookingResponse> getAllBookingsAdmin(Pageable pageable);
}
