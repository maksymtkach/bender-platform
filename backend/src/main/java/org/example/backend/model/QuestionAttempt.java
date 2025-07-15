package org.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.util.List;

@Entity
@Table(name = "question_attempts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionAttempt {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_attempt_id")
    private TestAttempt testAttempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    @ElementCollection
    @CollectionTable(name = "question_attempt_answers", joinColumns = @JoinColumn(name = "question_attempt_id"))
    @Column(name = "answer")
    private List<String> answers;

    private String openAnswer;

    private Boolean isCorrect;
}

