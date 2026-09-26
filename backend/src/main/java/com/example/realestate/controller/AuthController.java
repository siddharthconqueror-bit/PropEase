package com.example.realestate.controller;

import com.example.realestate.dto.request.LoginRequest;
import com.example.realestate.dto.request.RegisterRequest;
import com.example.realestate.dto.response.AuthResponse;
import com.example.realestate.dto.response.UserResponse;
import com.example.realestate.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user registration, authentication, and profile discovery")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user (Customer or Agent)", description = "Creates a new user profile with hashed password and generates an initial JWT token")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Login with credentials", description = "Verifies email and password, returning JWT access token and user metadata")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile", description = "Returns the profile details of the user extracted from the JWT token")
    public ResponseEntity<UserResponse> getCurrentUser() {
        UserResponse user = authService.getCurrentUser();
        return ResponseEntity.ok(user);
    }
}
