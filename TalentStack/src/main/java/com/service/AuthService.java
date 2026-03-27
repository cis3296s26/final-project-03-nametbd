package com.talentstack.api.service;

/**
 * AuthService implements account registration, login verification, and /me retrieval.
 *
 * It sanitizes user input, hashes passwords, persists user/profile records transactionally,
 * validates login credentials, and assembles authenticated profile response payloads.
 */

import com.talentstack.api.dto.*;
import com.talentstack.api.model.*;
import com.talentstack.api.repo.*;
import com.talentstack.api.util.InputSanitizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final UserProfileRepository profileRepo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public AuthService(UserRepository userRepo, UserProfileRepository profileRepo) {
        this.userRepo = userRepo;
        this.profileRepo = profileRepo;
    }

    @Transactional
    public Long signup(SignupRequest req) {
        String email = InputSanitizer.sanitizeEmail(req.email());
        if (userRepo.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User u = new User();
        u.setEmail(email);
        u.setPasswordHash(encoder.encode(req.password()));
        u = userRepo.save(u);

        UserProfile p = new UserProfile();
        p.setUser(u);
        p.setFirstName(InputSanitizer.sanitizeName(req.first_name()));
        p.setLastName(InputSanitizer.sanitizeName(req.last_name()));
        profileRepo.save(p);

        return u.getUserId();
    }

    public Long login(LoginRequest req) {
        User u = userRepo.findByEmail(InputSanitizer.sanitizeEmail(req.email()))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!encoder.matches(req.password(), u.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        return u.getUserId();
    }

    public MeResponse me(Long userId) {
        User u = userRepo.findById(userId).orElseThrow();
        UserProfile p = profileRepo.findById(userId).orElseThrow();

        return new MeResponse(
                u.getUserId(),
                u.getEmail(),
                p.getFirstName(),
                p.getLastName()
        );
    }
}
