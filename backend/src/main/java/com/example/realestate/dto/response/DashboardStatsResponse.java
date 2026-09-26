package com.example.realestate.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {
    private long totalUsers;
    private long totalCustomers;
    private long totalAgents;
    private long totalProperties;
    private long activeProperties;
    private long totalBookings;
    private long pendingBookings;
    private long confirmedBookings;
}
