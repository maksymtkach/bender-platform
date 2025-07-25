package org.example.backend.service;

import org.example.backend.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret", "super-very-long-test-secret-key-for-tests-1234567890");
        jwtService.init();
    }

    @Test
    void testGenerateAndExtractToken() {
        String email = "user@example.com";
        String token = jwtService.generateToken(email);

        assertNotNull(token, "Token must not be null");

        String extracted = jwtService.extractEmail(token);
        assertEquals(email, extracted, "Extracted email should match original");
    }

    @Test
    void testIsTokenValid() {
        String email = "user@example.com";
        String token = jwtService.generateToken(email);
        User user = new User();
        user.setEmail(email);

        assertTrue(jwtService.isTokenValid(token, user), "Token must be valid for correct user");
    }

    @Test
    void testIsTokenInvalidForOtherUser() {
        String token = jwtService.generateToken("user1@example.com");
        User user = new User();
        user.setEmail("user2@example.com");

        assertFalse(jwtService.isTokenValid(token, user), "Token must be invalid for wrong user");
    }
}
