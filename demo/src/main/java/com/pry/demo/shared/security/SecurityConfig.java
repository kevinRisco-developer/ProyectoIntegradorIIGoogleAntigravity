package com.pry.demo.shared.security;

import java.util.Arrays;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Sin autenticación válida (token ausente/expirado/inválido) → 401, no 403,
                // para que el frontend refresque el JWT de forma silenciosa. El 403 queda
                // reservado a "autenticado pero sin permiso" (rol incorrecto).
                .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) ->
                        response.sendError(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED, "No autenticado")))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        // Endpoints públicos del catálogo (HU-05, HU-06, HU-07, HU-08, HU-09)
                        .requestMatchers(HttpMethod.GET, "/producto/public/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/categoria/public/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/producto/destacados").permitAll()
                        .requestMatchers(HttpMethod.GET, "/producto/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/categoria/**").permitAll()
                        .requestMatchers("/admin/auditoria/**").hasAnyAuthority("ADMIN", "INVENTARIO")
                        .requestMatchers("/admin/backup/**").hasAuthority("ADMIN")
                        .requestMatchers("/admin/**").hasAuthority("ADMIN")
                        .requestMatchers("/usuario/**").hasAuthority("ADMIN")
                        // CRUD inventario — solo INVENTARIO o ADMIN
                        .requestMatchers(HttpMethod.POST, "/producto/**").hasAnyAuthority("ADMIN", "INVENTARIO")
                        .requestMatchers(HttpMethod.PUT, "/producto/**").hasAnyAuthority("ADMIN", "INVENTARIO")
                        .requestMatchers(HttpMethod.DELETE, "/producto/**").hasAnyAuthority("ADMIN", "INVENTARIO")
                        .requestMatchers(HttpMethod.POST, "/categoria/**").hasAnyAuthority("ADMIN", "INVENTARIO")
                        .requestMatchers(HttpMethod.PUT, "/categoria/**").hasAnyAuthority("ADMIN", "INVENTARIO")
                        .requestMatchers(HttpMethod.DELETE, "/categoria/**").hasAnyAuthority("ADMIN", "INVENTARIO")
                        .requestMatchers("/carrito/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/pedido/pagados").hasAuthority("VENDEDOR")
                        .requestMatchers(HttpMethod.PUT, "/pedido/*/entregar").hasAuthority("VENDEDOR")
                        .requestMatchers("/pedido/**").authenticated()
                        .requestMatchers("/pago/**").hasAuthority("ADMIN")
                        .requestMatchers("/mfa/**").authenticated()
                        .requestMatchers("/recomendacion/**").authenticated()
                        .anyRequest().authenticated());
                        
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); 
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
