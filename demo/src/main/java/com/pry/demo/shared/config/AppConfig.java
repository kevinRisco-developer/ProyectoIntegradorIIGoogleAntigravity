package com.pry.demo.shared.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class AppConfig {

    /** URL base del microservicio FastAPI de recomendaciones. */
    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * WebClient apuntando al servicio de IA (HU-15).
     * Se usa para consumir /recomendar y persistir el resultado en `recomendacion`.
     */
    @Bean
    public WebClient aiWebClient() {
        return WebClient.builder()
                .baseUrl(aiServiceUrl)
                .build();
    }
}
