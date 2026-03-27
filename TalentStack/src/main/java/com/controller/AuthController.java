package com.talentstack.api.controller;

/**
 * AuthController exposes authentication/session endpoints under /api.
 *
 * It handles signup, login, logout, and "me" retrieval by delegating credential/profile
 * operations to AuthService while managing the HTTP session and Spring Security context
 * needed for authenticated requests.
 */

import com.talentstack.api.dto.*;
import com.talentstack.api.service.AuthService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest req, HttpSession session) {
        Long userId = authService.signup(req);
        establishAuthenticatedSession(session, userId);
        return ResponseEntity.status(201).build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req, HttpSession session) {
        Long userId = authService.login(req);
        establishAuthenticatedSession(session, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        SecurityContextHolder.clearContext();
        session.invalidate();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponse> me(Authentication authentication, HttpSession session) {
            Long userId = resolveUserId(authentication, session);
            if (userId == null) {
                return ResponseEntity.status(401).build();
            }
            return ResponseEntity.ok(authService.me(userId));
        }

        private void establishAuthenticatedSession(HttpSession session, Long userId) {
        session.setAttribute("userId", userId);

                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        userId.toString(),
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_USER"))
                        );

                SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
    }

        private Long resolveUserId(Authentication authentication, HttpSession session) {
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() != null) {
                return Long.parseLong(authentication.getPrincipal().toString());
            }
        Object fromSession = session.getAttribute("userId");
        return fromSession instanceof Long ? (Long) fromSession : null;
    }
}
