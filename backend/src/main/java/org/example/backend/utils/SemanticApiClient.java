package org.example.backend.utils;

import org.hibernate.annotations.Comment;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Component
public class SemanticApiClient {
    private static final String EMBED_URL = "http://localhost:5010/embed";

    public static List<Double> getEmbedding(String text) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, String> body = Map.of("text", text);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(EMBED_URL, request, Map.class);
        if (response.getStatusCode().is2xxSuccessful()) {
            Map<String, Object> map = response.getBody();
            if (map != null && map.get("embedding") instanceof List) {
                List<Object> objList = (List<Object>) map.get("embedding");
                List<Double> doubleList = new ArrayList<>();
                for (Object o : objList) doubleList.add(Double.valueOf(o.toString()));
                return doubleList;
            }
        }
        return List.of();
    }
}

