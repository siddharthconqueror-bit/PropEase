package com.example.realestate.dto.response;

import com.example.realestate.entity.Role;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
