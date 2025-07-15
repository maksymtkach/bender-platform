package org.example.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.example.backend.model.Question;
import org.example.backend.model.Test;
import org.example.backend.model.User;
import org.example.backend.model.dto.TestAttemptResultDTO;
import org.example.backend.model.dto.TestAttemptSubmitDTO;
import org.example.backend.repository.TestRepository;
import org.example.backend.utils.KeywordApiClient;
import org.example.backend.utils.SemanticApiClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
public class TestService {
    private final TestRepository testRepository;
    private final SemanticApiClient semanticApiClient;
    private final KeywordApiClient keywordApiClient;

    public TestService(TestRepository testRepository, SemanticApiClient semanticApiClient, KeywordApiClient keywordApiClient) {
        this.testRepository = testRepository;
        this.semanticApiClient = semanticApiClient;
        this.keywordApiClient = keywordApiClient;
    }

    public Test saveTest(Test test) throws JsonProcessingException {
        // 1. Готуємо текст (опис + питання)
        StringBuilder allText = new StringBuilder();
        if (test.getDescription() != null)
            allText.append(test.getDescription()).append(" ");
        if (test.getQuestions() != null)
            test.getQuestions().forEach(q -> allText.append(q.getQuestion()).append(" "));

        // 2. Semantic embedding через Python API
        List<Double> embedding = semanticApiClient.getEmbedding(allText.toString());
        ObjectMapper mapper = new ObjectMapper();
        String embeddingJson = mapper.writeValueAsString(embedding);
        test.setEmbeddingJson(embeddingJson);

        // 3. Ключові слова через Python keyword API
        List<String> keywords = keywordApiClient.extractKeywords(allText.toString());
        test.setKeywords(keywords);

        // 4. Зберігаємо тест із embedding і keywords
        return testRepository.save(test);
    }
    public List<Test> getAllTests() {
        return testRepository.findAll();
    }

    public Test getTestById(Long id) {
        return testRepository.findById(id).orElse(null);
    }

    public TestAttemptResultDTO checkAndSaveAttempt(User user, TestAttemptSubmitDTO dto) {
        Test test = getTestById(dto.getTestId());
        double total = 0, max = 0;
        List<TestAttemptResultDTO.QuestionResultDTO> results = new ArrayList<>();

        for (int i = 0; i < dto.getAnswers().size(); i++) {
            var ans = dto.getAnswers().get(i);
            Question q = test.getQuestions().stream()
                    .filter(qq -> qq.getId().equals(ans.getQuestionId()))
                    .findFirst().orElseThrow();

            double weight = q.getWeight() != null ? q.getWeight() : 1.0;
            max += weight;

            boolean isCorrect = false;
            if (q.getIsOpen() != null && q.getIsOpen()) {
                isCorrect = q.getOptions().get(0).trim()
                        .equalsIgnoreCase(ans.getOpenAnswer() != null ? ans.getOpenAnswer().trim() : "");
            } else {
                isCorrect = new HashSet<>(ans.getAnswers())
                        .equals(new HashSet<>(q.getCorrect()));
            }
            if (isCorrect) total += weight;

            var qRes = new TestAttemptResultDTO.QuestionResultDTO();
            qRes.setQuestionId(q.getId());
            qRes.setQuestion(q.getQuestion());
            qRes.setIsCorrect(isCorrect);
            qRes.setCorrectAnswers(q.getCorrect());
            qRes.setUserAnswers(ans.getAnswers());
            qRes.setOpenAnswer(ans.getOpenAnswer());
            qRes.setCorrectOpenAnswer(q.getIsOpen() != null && q.getIsOpen() ? q.getOptions().get(0) : null);
            qRes.setWeight(weight);
            qRes.setAiExplain(q.getAiExplain());
            qRes.setOptions(q.getOptions());
            results.add(qRes);
        }

        var resultDto = new TestAttemptResultDTO();
        resultDto.setScore(total);
        resultDto.setMaxScore(max);
        resultDto.setQuestions(results);
        return resultDto;
    }
}

