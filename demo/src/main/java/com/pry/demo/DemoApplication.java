package com.pry.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableScheduling
public class DemoApplication {

	public static void main(String[] args) {
		// Cargar variables de entorno desde el archivo .env
		try {
			Dotenv dotenv = Dotenv.configure()
					.directory("./") // Localización del archivo .env
					.ignoreIfMissing()
					.load();

			java.util.Set<io.github.cdimascio.dotenv.DotenvEntry> entries = dotenv.entries();
			for (io.github.cdimascio.dotenv.DotenvEntry entry : entries) {
				System.setProperty(entry.getKey(), entry.getValue());
			}
			System.out.println("DEBUG: Se han cargado " + entries.size() + " variables desde el archivo .env");

		} catch (Exception e) {
			System.err.println("WARN: No se pudo cargar el archivo .env: " + e.getMessage());
		}

		SpringApplication.run(DemoApplication.class, args);
	}

	@org.springframework.context.annotation.Bean
	public org.springframework.web.client.RestTemplate restTemplate() {
		return new org.springframework.web.client.RestTemplate();
	}
}