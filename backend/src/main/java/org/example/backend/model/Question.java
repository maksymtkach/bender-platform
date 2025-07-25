package org.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue
    private Long id;

    private String question;

    private Boolean isOpen;

    @ElementCollection
    private List<String> options;

    @ElementCollection
    private List<Integer> correct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id")
    private Test test;

    @Builder.Default
    private Double weight = 1.0;

    private Boolean aiExplain;
}


