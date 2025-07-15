package org.example.backend.model.mapper;

import org.example.backend.model.Question;
import org.example.backend.model.Test;
import org.example.backend.model.User;
import org.example.backend.model.dto.QuestionDTO;
import org.example.backend.model.dto.TestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.example.backend.model.mapper.QuestionMapper;
import java.util.ArrayList;
import java.util.Locale;

@Component
public class TestMapper {

    @Autowired
    private QuestionMapper questionMapper;

    public TestDTO toDto(Test test) {
        return TestDTO.builder()
                .id(test.getId())
                .title(test.getTitle())
                .description(test.getDescription())
                .isPublic(test.isPublic())
                .authorId(test.getAuthor() != null ? test.getAuthor().getId() : null)
                .questions(test.getQuestions().stream()
                        .map(questionMapper::toDto)
                        .toList())
                .keywords(test.getKeywords())
                .build();
    }

    public Test toEntity(TestDTO dto, User author) {
        Test test = new Test();
        test.setTitle(dto.getTitle());
        test.setDescription(dto.getDescription());
        test.setPublic(Boolean.TRUE.equals(dto.getIsPublic()));
        test.setAuthor(author);
        test.setQuestions(new ArrayList<>());

        if (dto.getQuestions() != null) {
            for (QuestionDTO qDto : dto.getQuestions()) {
                Question q = questionMapper.toEntity(qDto);
                q.setTest(test);
                test.getQuestions().add(q);
            }
        }

        return test;
    }
}


