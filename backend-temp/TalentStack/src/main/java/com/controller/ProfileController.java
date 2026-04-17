package com.talentstack.api.controller;

import com.talentstack.api.dto.ProfileResponse;
import com.talentstack.api.dto.ProfileIdentityUpdateRequest;
import com.talentstack.api.service.UserDataService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

// REST controller for profile retrieval and updates
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    // Service dependency for user/profile data operations
    private final UserDataService userDataService;

    // Constructor injection
    public ProfileController(UserDataService userDataService) {
        this.userDataService = userDataService;
    }

    // Handles GET /api/profile
    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
        // Resolve user ID from Spring Security authentication object
        Long userId = AuthenticatedUser.resolveUserId(authentication);

        // If not authenticated, return 401
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        // Return profile data for the authenticated user
        return ResponseEntity.ok(userDataService.getProfile(userId));
    }

    // Handles PUT /api/profile
    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(
            @Valid @RequestBody ProfileIdentityUpdateRequest request,
            Authentication authentication
    ) {
        // Resolve user ID
        Long userId = AuthenticatedUser.resolveUserId(authentication);

        // Return 401 if invalid/no authenticated user
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        // Update the user's profile and return the updated record
        return ResponseEntity.ok(userDataService.updateProfile(userId, request));
    }
}