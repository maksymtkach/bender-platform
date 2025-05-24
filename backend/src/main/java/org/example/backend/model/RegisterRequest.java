package org.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//maybe DTO
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String password;
    private String username;
    private Integer age;
}
