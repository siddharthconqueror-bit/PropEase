package com.example.realestate.service;

import com.example.realestate.dto.request.LoginRequest;
import com.example.realestate.dto.request.RegisterRequest;
import com.example.realestate.dto.response.AuthResponse;
import com.example.realestate.dto.response.UserResponse;
import com.example.realestate.entity.Role;
import com.example.realestate.entity.User;
import com.example.realestate.exception.DuplicateEmailException;
import com.example.realestate.mapper.UserMapper;
import com.example.realestate.repository.UserRepository;
import com.example.realestate.security.JwtUtils;
import com.example.realestate.security.UserDetailsImpl;
import com.example.realestate.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;
    private UserResponse sampleUserResponse;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("Dinesh Natarajan")
                .email("dinesh@propease.in")
                .password("encoded_pass")
                .phone("+91 9876543210")
                .role(Role.CUSTOMER)
                .active(true)
                .build();

        sampleUserResponse = UserResponse.builder()
                .id(1L)
                .name("Dinesh Natarajan")
                .email("dinesh@propease.in")
                .role(Role.CUSTOMER)
                .active(true)
                .build();
    }

    @Test
    void register_Success() {
        RegisterRequest request = RegisterRequest.builder()
                .name("Dinesh Natarajan")
                .email("dinesh@propease.in")
                .password("password123")
                .phone("+91 9876543210")
                .role(Role.CUSTOMER)
                .build();

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(jwtUtils.generateJwtToken(any())).thenReturn("mock_jwt_token");
        when(userMapper.toResponse(any(User.class))).thenReturn(sampleUserResponse);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock_jwt_token", response.getToken());
        assertEquals("dinesh@propease.in", response.getUser().getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_ThrowsDuplicateEmail() {
        RegisterRequest request = RegisterRequest.builder()
                .name("Dinesh Natarajan")
                .email("dinesh@propease.in")
                .password("password123")
                .build();

        when(userRepository.existsByEmail("dinesh@propease.in")).thenReturn(true);

        assertThrows(DuplicateEmailException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        LoginRequest request = LoginRequest.builder()
                .email("dinesh@propease.in")
                .password("password123")
                .build();

        Authentication auth = mock(Authentication.class);
        UserDetailsImpl userDetails = UserDetailsImpl.build(sampleUser);
        when(auth.getPrincipal()).thenReturn(userDetails);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(jwtUtils.generateJwtToken(any())).thenReturn("mock_jwt_token");
        when(userRepository.findByEmail("dinesh@propease.in")).thenReturn(Optional.of(sampleUser));
        when(userMapper.toResponse(sampleUser)).thenReturn(sampleUserResponse);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock_jwt_token", response.getToken());
        assertEquals("dinesh@propease.in", response.getUser().getEmail());
    }
}
