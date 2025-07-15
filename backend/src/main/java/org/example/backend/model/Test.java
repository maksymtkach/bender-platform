// Test.java
package org.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name = "tests")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private boolean isPublic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User author;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @Builder.Default
    private Date createdAt = new Date();

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }

    @Column(name = "embedding", columnDefinition = "text") // або "jsonb" якщо Postgres
    private String embeddingJson;

    @ElementCollection
    @CollectionTable(name = "test_keywords", joinColumns = @JoinColumn(name = "test_id"))
    @Column(name = "keyword")
    private List<String> keywords = new ArrayList<>();
}
