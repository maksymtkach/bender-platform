package org.example.backend.controller;

import lombok.AllArgsConstructor;
import org.example.backend.model.LoginRequest;
import org.example.backend.model.RegisterRequest;
import org.example.backend.model.User;
import org.example.backend.service.JwtService;
import org.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@AllArgsConstructor
public class AuthController {
    //TODO: CRUD for users

    private final JwtService jwtService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().build();
        }

        if (!userService.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("User " + request.getUsername() + " doesn't exist. Create a new account");
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

        User user = userService.findByUsername(request.getUsername());

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Password incorrect");
        }

        String token = jwtService.generateToken(request.getUsername());
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getUsername() == null || request.getPassword() == null || request.getAge() == null) {
            return ResponseEntity.badRequest().build();
        }

        if (userService.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("User " + request.getUsername() + " already exists");
        }

        // better to use argon
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
        String encryptedPassword = encoder.encode(request.getPassword());

        userService.saveUser(
                User.builder()
                        .username(request.getUsername())
                        .password(encryptedPassword)
                        .age(request.getAge())
                        .build()
        );

        return ResponseEntity.ok(request.getUsername() + " has been registered");
    }
}
