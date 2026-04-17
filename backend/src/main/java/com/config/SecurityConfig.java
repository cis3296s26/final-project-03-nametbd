package com.talentstack.api.config;

// Spring configuration annotations
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// Spring Security configuration utilities
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

// Password encoding (BCrypt adaptive hashing)
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

// Security filter chain (core of Spring Security)
import org.springframework.security.web.SecurityFilterChain;

// Marks this class as a Spring configuration class
@Configuration
public class SecurityConfig {

    /**
     * PasswordEncoder bean
     *
     * This defines how passwords are hashed and verified throughout the application.
     * Spring automatically injects this wherever PasswordEncoder is required.
     */
    @Bean
    PasswordEncoder passwordEncoder() {

        // BCrypt is an adaptive hashing algorithm:
        // - Automatically generates a unique salt for each password
        // - Intentionally slow (resists brute-force attacks)
        // - Strength (12) controls cost factor (higher = slower but more secure)
        return new BCryptPasswordEncoder(12);
    }

    /**
     * SecurityFilterChain bean
     *
     * This configures all HTTP security behavior:
     * - authentication rules
     * - session handling
     * - headers and protections
     */
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http

                /**
                 * CSRF protection
                 *
                 * Disabled here because:
                 * - likely using stateless APIs or controlled frontend
                 * - or relying on session + same-origin policies
                 *
                 * NOTE: In production, consider enabling CSRF if using cookies for auth.
                 */
                .csrf(csrf -> csrf.disable())

                /**
                 * CORS configuration
                 *
                 * Allows cross-origin requests using default Spring settings.
                 */
                .cors(Customizer.withDefaults())

                /**
                 * Session management
                 *
                 * IF_REQUIRED means:
                 * - create a session only when needed (e.g., after login)
                 * - avoids unnecessary session creation
                 */
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )

                /**
                 * Security headers
                 *
                 * Protects against common browser-based attacks
                 */
                .headers(headers -> headers

                        // Content Security Policy (CSP)
                        // Restricts what resources can be loaded
                        .contentSecurityPolicy(csp -> csp.policyDirectives(
                                "default-src 'self'; " +
                                        "object-src 'none'; " +
                                        "frame-ancestors 'none'; " +
                                        "base-uri 'self'; " +
                                        "form-action 'self'"
                        ))

                        // Prevents clickjacking by blocking iframe embedding
                        .frameOptions(frame -> frame.deny())

                        // Enables browser XSS protections (legacy but still useful)
                        .xssProtection(Customizer.withDefaults())

                        // Enforces HTTPS (HSTS)
                        .httpStrictTransportSecurity(hsts -> hsts
                                .includeSubDomains(true)   // applies to all subdomains
                                .maxAgeInSeconds(31536000) // 1 year
                        )
                )

                /**
                 * Authorization rules
                 *
                 * Defines which endpoints require authentication
                 */
                .authorizeHttpRequests(auth -> auth

                        // Public endpoints (no authentication required)
                        .requestMatchers(
                                "/",                 // root SPA route
                                "/index.html",       // main frontend file
                                "/login",            // login page
                                "/signup",           // signup page
                                "/dashboard",        // SPA route
                                "/settings",         // SPA route
                                "/profile",          // SPA route
                                "/actuator/health",  // health check endpoint
                                "/actuator/info",    // info endpoint
                                "/api/login",        // login API
                                "/api/signup"        // signup API
                        ).permitAll()

                        // Protected endpoints (require authenticated user)
                        .requestMatchers(
                                "/api/logout",
                                "/api/profile/**",
                                "/api/notifications/**",
                                "/api/jobs/**"
                        ).authenticated()

                        // All other requests are allowed (fallback rule)
                        .anyRequest().permitAll()
                );

        // Build and return the configured security filter chain
        return http.build();
    }
}