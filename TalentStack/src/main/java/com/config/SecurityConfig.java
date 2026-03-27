package com.talentstack.api.config;

/**
 * SecurityConfig defines the application's Spring Security HTTP configuration.
 *
 * It sets statelessness policy for session creation, common secure headers, request
 * authorization rules for public vs authenticated endpoints, and baseline CSRF/CORS
 * behavior.
 */

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .headers(headers -> headers
                        .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"))
                        .frameOptions(frame -> frame.deny())
                        .xssProtection(Customizer.withDefaults())
                        .httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31536000))
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/login",
                                "/signup",
                                "/dashboard",
                                "/settings",
                                "/profile",
                                "/actuator/health",
                                "/actuator/info",
                                "/api/login",
                                "/api/signup"
                        ).permitAll()
                        .requestMatchers("/api/logout", "/api/me", "/api/profile/**", "/api/notifications/**").authenticated().anyRequest().permitAll()
                );
        return http.build();
    }
}