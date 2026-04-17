package com.talentstack.api.controller;

import com.talentstack.api.dto.JobPreferencesRequest;
import com.talentstack.api.dto.JobPreferencesResponse;
import com.talentstack.api.service.UserDataService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

// REST controller for managing job preference data
@RestController
@RequestMapping("/api/jobs/preferences")
public class JobPreferencesController {

    // Service dependency used to read/update user data
    private final UserDataService userDataService;

    // Constructor injection
    public JobPreferencesController(UserDataService userDataService) {
        this.userDataService = userDataService;
    }

    // Handles GET /api/jobs/preferences
    @GetMapping
    public ResponseEntity<JobPreferencesResponse> getPreferences(Authentication authentication) {
        // Resolve the logged-in user's ID from Spring Security
        Long userId = AuthenticatedUser.resolveUserId(authentication);

        // If no valid authenticated user is found, return 401
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        // Return the user's saved job preferences
        return ResponseEntity.ok(userDataService.getJobPreferences(userId));
    }

    // Handles PUT /api/jobs/preferences
    @PutMapping
    public ResponseEntity<JobPreferencesResponse> updatePreferences(
            @Valid @RequestBody JobPreferencesRequest request,
            Authentication authentication
    ) {
        // Resolve the authenticated user's ID
        Long userId = AuthenticatedUser.resolveUserId(authentication);

        // Return 401 if not authenticated
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        // Update preferences for the user and return the saved version
        return ResponseEntity.ok(userDataService.updateJobPreferences(userId, request));
    }
}