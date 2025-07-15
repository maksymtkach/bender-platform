package org.example.backend.model.dto;

import lombok.Data;
import java.util.List;

@Data
public class TestAttemptSubmitDTO {
    private Long testId;
    private List<AnswerDTO> answers;

    @Data
    public static class AnswerDTO {
        private Long questionId;
        private List<Integer> answers;
        private String openAnswer;
    }
}