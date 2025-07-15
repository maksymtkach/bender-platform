package org.example.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TestDTO {
    private long id;
    private String title;
    private String description;
    private Boolean isPublic;
    private Long authorId;
    private List<QuestionDTO> questions;
    private List<String> keywords;
}

