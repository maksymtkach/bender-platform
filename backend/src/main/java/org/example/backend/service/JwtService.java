package org.example.backend.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

import io.jsonwebtoken.security.Keys;

//TODO: add annotations to clarify the purpose of the class
@Service
public class JwtService {
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username) // username based token
                .setIssuedAt(new Date()) // current time
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(key) // used key
                .compact();
    }

    public String extractUsername(String token) {
        //TODO: not sure what's the purpose of this method
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJwt(token)
                .getBody()
                .getSubject();
    }
}
