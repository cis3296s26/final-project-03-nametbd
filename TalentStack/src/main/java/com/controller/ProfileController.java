package com.talentstack.api.controller;

/**
 * ProfileController handles read and update operations for the current user's profile.
 *
 * It enforces session-backed authentication at controller level and delegates profile
 * business logic to UserDataService.
 */

import com.talentstack.api.dto.ProfileResponse;
import com.talentstack.api.dto.ProfileUpdateRequest;
import com.talentstack.api.service.UserDataService;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserDataService userDataService;

    public ProfileController(UserDataService userDataService) {
        this.userDataService = userDataService;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(userDataService.getProfile(userId));
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(@Valid @RequestBody ProfileUpdateRequest request, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(userDataService.updateProfile(userId, request));
    }
}
