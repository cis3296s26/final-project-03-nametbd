package com.talentstack.api.controller;

import com.talentstack.api.dto.JobPreferencesRequest;
import com.talentstack.api.dto.JobSearchRequest;
import com.talentstack.api.dto.JobSearchResponse;
import com.talentstack.api.dto.ProfileResponse;
import com.talentstack.api.service.AdzunaJobService;
import com.talentstack.api.service.UserDataService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

// REST controller for searching jobs and building dashboard job data
@RestController
@RequestMapping("/api/jobs")
public class JobSearchController {

    // Service used to read profile/user preference data
    private final UserDataService userDataService;

    // Service used to call the Adzuna jobs API
    private final AdzunaJobService adzunaJobService;

    // Constructor injection
    public JobSearchController(UserDataService userDataService, AdzunaJobService adzunaJobService) {
        this.userDataService = userDataService;
        this.adzunaJobService = adzunaJobService;
    }

    // Handles GET /api/jobs/dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<JobSearchResponse> getDashboardJobs(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize,
            Authentication authentication
    ) {
        // Get the logged-in user's ID
        Long userId = AuthenticatedUser.resolveUserId(authentication);

        // If not logged in, return 401
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        // Load the user's profile information
        ProfileResponse profile = userDataService.getProfile(userId);

        // Convert profile data into a job preferences request
        JobPreferencesRequest request = new JobPreferencesRequest(
                profile.keyWords(),
                profile.location(),
                profile.distance(),
                profile.salaryMin(),
                profile.salaryMax(),
                profile.contractType(),
                profile.maxDaysOld()
        );

        // Search jobs using the user's saved profile values
        return ResponseEntity.ok(adzunaJobService.searchJobs(request, page, pageSize));
    }

    // Handles POST /api/jobs/search
    @PostMapping("/search")
    public ResponseEntity<JobSearchResponse> searchJobs(
            @Valid @RequestBody JobSearchRequest request,
            Authentication authentication
    ) {
        // Resolve authenticated user
        Long userId = AuthenticatedUser.resolveUserId(authentication);

        // Return 401 if not logged in
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        // Run a job search using the explicitly supplied search request
        return ResponseEntity.ok(
                adzunaJobService.searchJobs(request.preferences(), request.page(), request.pageSize())
        );
    }
}