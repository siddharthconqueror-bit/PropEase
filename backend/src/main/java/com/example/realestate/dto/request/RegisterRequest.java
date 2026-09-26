package com.example.realestate.dto.request;

import com.example.realestate.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 120, message = "Email cannot exceed 120 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 50, message = "Password must be at least 6 characters")
    private String password;

    @Pattern(regexp = "^\\+?[0-9\\s-]{8,20}$", message = "Please enter a valid phone number")
    private String phone;

    private Role role; // Optional, defaults to CUSTOMER if null or ADMIN is blocked
}
