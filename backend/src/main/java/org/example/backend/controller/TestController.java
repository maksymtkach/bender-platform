package org.example.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.example.backend.model.Test;
import org.example.backend.model.User;
import org.example.backend.model.dto.TestAttemptResultDTO;
import org.example.backend.model.dto.TestAttemptSubmitDTO;
import org.example.backend.model.dto.TestDTO;
import org.example.backend.service.JwtService;
import org.example.backend.service.TestService;
import org.example.backend.service.UserService;
import org.example.backend.utils.SemanticApiClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.backend.model.mapper.TestMapper;

import java.util.List;
import java.util.stream.Collectors;

//TODO: add Swagger doc notes
@RestController
@RequestMapping("/api/v1/tests")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;
    private final JwtService jwtService;
    private final UserService userService;
    private final TestMapper testMapper;
    private final SemanticApiClient semanticApiClient;


    @PostMapping
    public ResponseEntity<Void> createTest(
            @RequestBody TestDTO dto,
            @RequestHeader("Authorization") String authorizationHeader) throws JsonProcessingException {
        String token = authorizationHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);

        User user = userService.findByEmail(email);

        Test entity = testMapper.toEntity(dto, user);
        testService.saveTest(entity);

        return ResponseEntity.ok().build();
    }


    @GetMapping("/all")
    public List<TestDTO> getAll(@RequestHeader("Authorization") String authHeader) {
        return testService.getAllTests()
                .stream()
                .map(testMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestDTO> getTestById(@PathVariable Long id) {
        Test test = testService.getTestById(id);
        if (test == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(testMapper.toDto(test));
    }

    @GetMapping("/embedding")
    public ResponseEntity<?> getTestEmbedding(@RequestParam String text) {
        List<Double> embedding = semanticApiClient.getEmbedding(text);
        return ResponseEntity.ok(embedding);
    }

    @PostMapping("/submit")
    public ResponseEntity<TestAttemptResultDTO> submit(
            @RequestBody TestAttemptSubmitDTO dto,
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        String token = authorizationHeader.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);
        User user = userService.findByEmail(email);

        TestAttemptResultDTO result = testService.checkAndSaveAttempt(user, dto);
        return ResponseEntity.ok(result);
    }
}

