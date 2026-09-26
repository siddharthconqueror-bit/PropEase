package com.example.realestate.repository;

import com.example.realestate.entity.Booking;
import com.example.realestate.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByCustomerId(Long customerId, Pageable pageable);

    Page<Booking> findByPropertyAgentId(Long agentId, Pageable pageable);

    Page<Booking> findByPropertyAgentIdAndStatus(Long agentId, BookingStatus status, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.property.id = :propertyId AND b.bookingDate = :bookingDate AND b.status IN :activeStatuses")
    List<Booking> findConflictingBookings(
            @Param("propertyId") Long propertyId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("activeStatuses") List<BookingStatus> activeStatuses
    );

    long countByStatus(BookingStatus status);

    long countByPropertyAgentId(Long agentId);

    long countByPropertyAgentIdAndStatus(Long agentId, BookingStatus status);

    long countByCustomerId(Long customerId);
}
