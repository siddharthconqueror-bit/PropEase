package com.example.realestate.service.impl;

import com.example.realestate.dto.request.LoginRequest;
import com.example.realestate.dto.request.RegisterRequest;
import com.example.realestate.dto.response.AuthResponse;
import com.example.realestate.dto.response.UserResponse;
import com.example.realestate.entity.Role;
import com.example.realestate.entity.User;
import com.example.realestate.exception.DuplicateEmailException;
import com.example.realestate.exception.ResourceNotFoundException;
import com.example.realestate.mapper.UserMapper;
import com.example.realestate.repository.UserRepository;
import com.example.realestate.security.JwtUtils;
import com.example.realestate.security.UserDetailsImpl;
import com.example.realestate.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email is already registered: " + request.getEmail());
        }

        // Public registration cannot create ADMIN role
        Role assignedRole = Role.CUSTOMER;
        if (request.getRole() == Role.AGENT) {
            assignedRole = Role.AGENT;
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(assignedRole)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .user(userMapper.toResponse(savedUser))
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userDetails.getUsername()));

        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .user(userMapper.toResponse(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new ResourceNotFoundException("No authenticated user found in session");
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userDetails.getId()));

        return userMapper.toResponse(user);
    }
}
