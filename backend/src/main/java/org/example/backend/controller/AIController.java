package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.dto.AIExplanationRequestDTO;
import org.example.backend.model.dto.AIExplanationResponseDTO;
import org.example.backend.service.OpenAIService;
import org.springframework.web.bind.annotation.*;

//TODO: add Swagger doc notes
@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AIController {

    private final OpenAIService openAIService;

    @PostMapping("/explain")
    public AIExplanationResponseDTO explain(@RequestBody AIExplanationRequestDTO dto) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Explain this question for a student:\n");
        prompt.append("Question: ").append(dto.getQuestion()).append("\n");
        if (dto.getOptions() != null && !dto.getOptions().isEmpty()) {
            prompt.append("Options: ").append(String.join(", ", dto.getOptions())).append("\n");
        }
        prompt.append("Correct answer: ").append(dto.getCorrectAnswer()).append("\n");
        if (dto.getUserAnswer() != null) {
            prompt.append("Student's answer: ").append(dto.getUserAnswer()).append("\n");
        }
        prompt.append("Please, explain the logic and, if student's answer is wrong, provide a short feedback why.\n");

        String explanation = openAIService.getExplanation(prompt.toString());

        AIExplanationResponseDTO response = new AIExplanationResponseDTO();
        response.setExplanation(explanation);
        return response;
    }
}

