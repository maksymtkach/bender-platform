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
public class QuestionDTO {
    private Long id;
    private String question;
    private Boolean isOpen;
    private List<String> options;
    private List<Integer> correct;
    private Double weight;
    private Boolean aiExplain;
}

