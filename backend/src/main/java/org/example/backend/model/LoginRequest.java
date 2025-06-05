package org.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

//maybe DTO
@Data
@AllArgsConstructor
public class LoginRequest {
    private String password;
    private String email;
}
