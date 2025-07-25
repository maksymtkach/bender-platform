package org.example.backend.controller;

import com.nimbusds.oauth2.sdk.id.ClientID;
import lombok.AllArgsConstructor;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.example.backend.model.LoginRequest;
import org.example.backend.model.RegisterRequest;
import org.example.backend.model.User;
import org.example.backend.model.UserRole;
import org.example.backend.model.dto.UserDTO;
import org.example.backend.model.mapper.UserMapper;
import org.example.backend.service.GoogleAuthService;
import org.example.backend.service.JwtService;
import org.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Map;

//TODO: add annotations to clarify the purpose of the class
//TODO: maybe restructure on several files + superclass
//TODO: add Swagger doc notes
@RestController
@RequestMapping("/api/v1/auth")
@AllArgsConstructor
public class AuthController {
    private final JwtService jwtService;
    private final UserService userService;
    private final GoogleAuthService googleAuthService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().build();
        }

        if (!userService.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("User " + request.getEmail() + " doesn't exist. Create a new account");
        }

        //TODO: locate in the dedicated service (?)
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

        User user = userService.findByEmail(request.getEmail());

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Password incorrect");
        }

        String token = jwtService.generateToken(request.getEmail());
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody Map<String, String> body) throws GeneralSecurityException, IOException {
        String idTokenString = body.get("token");
        if (idTokenString == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token is missing"));
        }

        GoogleIdToken idToken;
        try {
            idToken = googleAuthService.verifyToken(idTokenString);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid ID token"));
        }

        if (idToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid ID token"));
        }

        var payload = idToken.getPayload();
        String email = payload.getEmail();

        User user = userService.findByEmail(email);

        if (user == null) {
            String name = (String) payload.get("name");
            user = new User();
            user.setEmail(email);
            user.setUsername(name != null ? name : email);
            user.setRole(UserRole.USER);
            user = userService.saveUser(user);
        }

        String jwt = jwtService.generateToken(user.getEmail());
        return ResponseEntity.ok(Map.of("token", jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getEmail() == null || request.getPassword() == null || request.getAge() == null) {
            return ResponseEntity.badRequest().build();
        }

        if (userService.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("User " + request.getEmail() + " already exists");
        }

        // better to use argon
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
        String encryptedPassword = encoder.encode(request.getPassword());

        userService.saveUser(
                User.builder()
                        .email(request.getEmail())
                        .username(request.getEmail().toUpperCase())
                        .password(encryptedPassword)
                        .age(request.getAge())
                        .role(UserRole.USER)
                        .build()
        );

        return ResponseEntity.ok(request.getEmail() + " has been registered");
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMe(
            @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");

        String email = jwtService.extractEmail(token);

        User user = userService.findByEmail(email);
        UserDTO dto = UserMapper.toDto(user);
        return ResponseEntity.ok(dto);
    }
}
