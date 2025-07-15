package org.example.backend.model.dto;

import lombok.Data;
import java.util.List;

@Data
public class TestAttemptResultDTO {
    private double score;
    private double maxScore;
    private List<QuestionResultDTO> questions;

    @Data
    public static class QuestionResultDTO {
        private Long questionId;
        private String question;
        private Boolean isCorrect;
        private List<Integer> correctAnswers;
        private List<Integer> userAnswers;
        private String openAnswer;
        private String correctOpenAnswer;
        private double weight;
        private Boolean aiExplain;
        private List<String> options;
    }
}
