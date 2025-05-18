package org.example.backend.controller;

import lombok.AllArgsConstructor;
import org.example.backend.model.LoginRequest;
import org.example.backend.model.RegisterRequest;
import org.example.backend.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@AllArgsConstructor
public class AuthController {
    //TODO: CRUD for users

    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().build();
        }

        if (!request.getUsername().equals("admin@gmail.com") || !request.getPassword().equals("admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        String token = jwtService.generateToken(request.getUsername());
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getUsername() == null || request.getPassword() == null || request.getAge() == null) {
            return ResponseEntity.badRequest().build();
        }

        if (request.getUsername().equals("admin@gmail.com") || request.getPassword().equals("admin")) {
            return ResponseEntity.badRequest().body("User already exists");
        }

        return ResponseEntity.ok("Successfully registered");
    }
}
