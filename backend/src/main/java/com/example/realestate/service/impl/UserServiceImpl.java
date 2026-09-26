package com.example.realestate.service.impl;

import com.example.realestate.dto.request.UserStatusUpdateRequest;
import com.example.realestate.dto.response.PageResponse;
import com.example.realestate.dto.response.UserResponse;
import com.example.realestate.entity.Role;
import com.example.realestate.entity.User;
import com.example.realestate.exception.ResourceNotFoundException;
import com.example.realestate.mapper.UserMapper;
import com.example.realestate.repository.UserRepository;
import com.example.realestate.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getAllUsers(Role role, Pageable pageable) {
        Page<User> userPage;
        if (role != null) {
            userPage = userRepository.findByRole(role, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }
        return PageResponse.from(userPage.map(userMapper::toResponse));
    }

    @Override
    @Transactional
    public UserResponse updateUserStatus(Long id, UserStatusUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        user.setActive(request.getActive());
        User updated = userRepository.save(user);
        return userMapper.toResponse(updated);
    }
}
