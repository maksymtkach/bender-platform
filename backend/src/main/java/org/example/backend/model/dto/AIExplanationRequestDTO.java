package org.example.backend.model.dto;

import java.util.List;
import lombok.Data;

@Data
public class AIExplanationRequestDTO {
    private String question;
    private List<String> options;
    private Object correctAnswer;
    private Object userAnswer;
}

