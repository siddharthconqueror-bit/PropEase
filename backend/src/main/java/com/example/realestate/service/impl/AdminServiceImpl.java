package com.example.realestate.service.impl;

import com.example.realestate.dto.response.DashboardStatsResponse;
import com.example.realestate.entity.BookingStatus;
import com.example.realestate.entity.PropertyStatus;
import com.example.realestate.entity.Role;
import com.example.realestate.repository.BookingRepository;
import com.example.realestate.repository.PropertyRepository;
import com.example.realestate.repository.UserRepository;
import com.example.realestate.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final BookingRepository bookingRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalCustomers = userRepository.countByRole(Role.CUSTOMER);
        long totalAgents = userRepository.countByRole(Role.AGENT);

        long totalProperties = propertyRepository.count();
        long activeProperties = propertyRepository.countByStatus(PropertyStatus.AVAILABLE);

        long totalBookings = bookingRepository.count();
        long pendingBookings = bookingRepository.countByStatus(BookingStatus.PENDING);
        long confirmedBookings = bookingRepository.countByStatus(BookingStatus.CONFIRMED);

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalCustomers(totalCustomers)
                .totalAgents(totalAgents)
                .totalProperties(totalProperties)
                .activeProperties(activeProperties)
                .totalBookings(totalBookings)
                .pendingBookings(pendingBookings)
                .confirmedBookings(confirmedBookings)
                .build();
    }
}
