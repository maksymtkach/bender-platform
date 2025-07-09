package org.example.backend.model.mapper;

import org.example.backend.model.User;
import org.example.backend.model.dto.UserDTO;

public class UserMapper {
    public static UserDTO toDto(User user) {
        UserDTO dto = new UserDTO();
        dto.setEmail(user.getEmail());
        dto.setName(user.getUsername());
        dto.setRole(user.getRole().toString());
        dto.setAge(user.getAge());
        return dto;
    }
}
