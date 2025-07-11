package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.Test;
import org.example.backend.model.User;
import org.example.backend.model.dto.TestDTO;
import org.example.backend.service.JwtService;
import org.example.backend.service.TestService;
import org.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.backend.model.mapper.TestMapper;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/tests")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;
    private final JwtService jwtService;
    private final UserService userService;
    private final TestMapper testMapper;

    @PostMapping
    public ResponseEntity<Void> createTest(
            @RequestBody TestDTO dto,
            @RequestHeader("Authorization") String authorizationHeader) {

        System.out.println(dto); // <- це покаже, що реально приходить

        String token = authorizationHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);

        User user = userService.findByEmail(email);

        Test entity = testMapper.toEntity(dto, user);
        testService.saveTest(entity);

        return ResponseEntity.ok().build();
    }


    @GetMapping
    public List<TestDTO> getAll() {
        return testService.getAllTests()
                .stream()
                .map(testMapper::toDto)
                .collect(Collectors.toList());
    }
}

