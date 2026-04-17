package com.talentstack.api.service;

import com.talentstack.api.dto.LoginRequest;
import com.talentstack.api.dto.SignupRequest;
import com.talentstack.api.model.User;
import com.talentstack.api.model.UserProfile;
import com.talentstack.api.repo.UserProfileRepository;
import com.talentstack.api.repo.UserRepository;
import com.talentstack.api.util.InputSanitizer;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final UserProfileRepository profileRepo;
    private final PasswordEncoder encoder;

    public AuthService(UserRepository userRepo, UserProfileRepository profileRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.profileRepo = profileRepo;
        this.encoder = encoder;
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
        p.setAge(0);
        profileRepo.save(p);

        return u.getUserId();
    }

    @Transactional
    public Long login(LoginRequest req) {
        User u = userRepo.findByEmail(InputSanitizer.sanitizeEmail(req.email()))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!encoder.matches(req.password(), u.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return u.getUserId();
    }
}