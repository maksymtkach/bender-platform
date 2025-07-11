package org.example.backend.model.mapper;

import org.example.backend.model.Question;
import org.example.backend.model.dto.QuestionDTO;
import org.springframework.stereotype.Component;

@Component
public class QuestionMapper {

    public QuestionDTO toDto(Question question) {
        return QuestionDTO.builder()
                .id(question.getId())
                .question(question.getQuestion())
                .isOpen(question.isOpen())
                .options(question.getOptions())
                .correctAnswers(question.getCorrectAnswers())
                .build();
    }

    public Question toEntity(QuestionDTO dto) {
        return Question.builder()
                .question(dto.getQuestion())
                .isOpen(dto.isOpen())
                .options(dto.getOptions())
                .correctAnswers(dto.getCorrectAnswers())
                .build();
    }
}
