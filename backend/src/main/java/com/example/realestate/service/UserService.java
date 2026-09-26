package com.example.realestate.service;

import com.example.realestate.dto.request.UserStatusUpdateRequest;
import com.example.realestate.dto.response.PageResponse;
import com.example.realestate.dto.response.UserResponse;
import com.example.realestate.entity.Role;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserResponse getUserById(Long id);
    PageResponse<UserResponse> getAllUsers(Role role, Pageable pageable);
    UserResponse updateUserStatus(Long id, UserStatusUpdateRequest request);
}
