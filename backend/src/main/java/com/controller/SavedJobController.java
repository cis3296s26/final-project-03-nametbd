package com.talentstack.api.controller;

import com.talentstack.api.dto.SaveJobRequest;
import com.talentstack.api.dto.SavedJobResponse;
import com.talentstack.api.dto.UpdateApplicationStatusRequest;
import com.talentstack.api.service.SavedJobService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs/saved")
public class SavedJobController {

    private final SavedJobService savedJobService;

    public SavedJobController(SavedJobService savedJobService) {
        this.savedJobService = savedJobService;
    }

    @GetMapping
    public ResponseEntity<List<SavedJobResponse>> getSavedJobs(Authentication authentication) {
        Long userId = AuthenticatedUser.resolveUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(savedJobService.getSavedJobs(userId));
    }

    @PostMapping
    public ResponseEntity<SavedJobResponse> saveJob(
            @Valid @RequestBody SaveJobRequest request,
            Authentication authentication
    ) {
        Long userId = AuthenticatedUser.resolveUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(savedJobService.saveJob(userId, request));
    }

    @PutMapping("/{savedJobId}/status")
    public ResponseEntity<SavedJobResponse> updateApplicationStatus(
            @PathVariable Long savedJobId,
            @Valid @RequestBody UpdateApplicationStatusRequest request,
            Authentication authentication
    ) {
        Long userId = AuthenticatedUser.resolveUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(
                savedJobService.updateApplicationStatus(userId, savedJobId, request.applicationStatus())
        );
    }
}