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
                .isOpen(question.getIsOpen())
                .options(question.getOptions())
                .correct(question.getCorrect())
                .weight(question.getWeight())
                .aiExplain(question.getAiExplain())
                .build();
    }

    public Question toEntity(QuestionDTO dto) {
        return Question.builder()
                .question(dto.getQuestion())
                .isOpen(dto.getIsOpen())
                .options(dto.getOptions())
                .correct(dto.getCorrect())
                .weight(dto.getWeight() != null ? dto.getWeight() : 1.0)
                .aiExplain(dto.getAiExplain())
                .build();
    }
}
