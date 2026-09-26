package com.example.realestate.service;

import com.example.realestate.dto.request.LoginRequest;
import com.example.realestate.dto.request.RegisterRequest;
import com.example.realestate.dto.response.AuthResponse;
import com.example.realestate.dto.response.UserResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserResponse getCurrentUser();
}
