package org.example.backend.utils;

import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Component
public class KeywordApiClient {
    private static final String KEYWORD_API_URL = "http://localhost:5005/extract";

    public static List<String> extractKeywords(String text) {
        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> requestBody = Map.of("text", text);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                KEYWORD_API_URL,
                HttpMethod.POST,
                request,
                Map.class
        );
        if (response.getStatusCode().is2xxSuccessful()) {
            Map<String, Object> map = response.getBody();
            if (map != null && map.get("keywords") instanceof List) {
                return (List<String>) map.get("keywords");
            }
        }
        return List.of();
    }
}