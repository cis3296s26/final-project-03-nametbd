package com.talentstack.api.controller;

// Request DTOs for login and signup
import com.talentstack.api.dto.LoginRequest;
import com.talentstack.api.dto.SignupRequest;

// Service that performs authentication business logic
import com.talentstack.api.service.AuthService;

// Session support
import jakarta.servlet.http.HttpSession;

// Validation support
import jakarta.validation.Valid;

// HTTP response support
import org.springframework.http.ResponseEntity;

// Spring Security authentication classes
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;

// REST annotations
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Marks this as a REST controller with base path /api
@RestController
@RequestMapping("/api")
public class AuthController {

    // Service dependency for signup/login operations
    private final AuthService authService;

    // Constructor injection
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Handles POST /api/signup
    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@Valid @RequestBody SignupRequest req, HttpSession session) {
        // Creates a new user and returns the new user ID
        Long userId = authService.signup(req);

        // Immediately logs the user in by creating an authenticated session
        establishAuthenticatedSession(session, userId);

        // Returns HTTP 201 Created
        return ResponseEntity.status(201).build();
    }

    // Handles POST /api/login
    @PostMapping("/login")
    public ResponseEntity<Void> login(@Valid @RequestBody LoginRequest req, HttpSession session) {
        // Authenticates user credentials and returns their user ID
        Long userId = authService.login(req);

        // Stores an authenticated security context in the session
        establishAuthenticatedSession(session, userId);

        // Returns HTTP 200 OK
        return ResponseEntity.ok().build();
    }

    // Handles POST /api/logout
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        // Clears security context from the current thread
        SecurityContextHolder.clearContext();

        // Invalidates the HTTP session entirely
        session.invalidate();

        // Returns HTTP 200 OK
        return ResponseEntity.ok().build();
    }

    // Private helper to create a Spring Security authenticated session
    private void establishAuthenticatedSession(HttpSession session, Long userId) {
        // Create an Authentication object using the user ID as the principal
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userId.toString(), // principal
                null,              // no credentials stored in session
                List.of(new SimpleGrantedAuthority("ROLE_USER")) // assign USER role
        );

        // Create a new empty security context
        SecurityContext context = SecurityContextHolder.createEmptyContext();

        // Put the authentication object into the context
        context.setAuthentication(authentication);

        // Set it as the current thread's security context
        SecurityContextHolder.setContext(context);

        // Save the security context into the HTTP session
        session.setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                context
        );
    }
}