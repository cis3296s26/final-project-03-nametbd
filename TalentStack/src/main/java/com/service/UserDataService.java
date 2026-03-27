package com.talentstack.api.service;

/**
 * UserDataService handles user profile read/update workflows.
 *
 * It fetches account and profile entities, sanitizes editable fields on update, persists
 * changes transactionally, and maps domain objects into ProfileResponse DTOs.
 */

import com.talentstack.api.dto.*;
import com.talentstack.api.model.*;
import com.talentstack.api.repo.*;
import com.talentstack.api.util.InputSanitizer;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserDataService{
    private final UserRepository userRepo;
    private final UserProfileRepository profileRepo;

    public UserDataService(
            UserRepository userRepo,
            UserProfileRepository profileRepo
    ){
        this.userRepo = userRepo;
        this.profileRepo = profileRepo;
    }

    public ProfileResponse getProfile(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        UserProfile profile = profileRepo.findById(userId).orElseThrow();
        return toProfileResponse(user, profile);
    }

    @Transactional
    public ProfileResponse updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepo.findById(userId).orElseThrow();
        UserProfile profile = profileRepo.findById(userId).orElseThrow();

        user.setEmail(InputSanitizer.sanitizeEmail(request.email()));
        profile.setFirstName(InputSanitizer.sanitizeName(request.firstName()));
        profile.setLastName(InputSanitizer.sanitizeName(request.lastName()));

        userRepo.save(user);
        profileRepo.save(profile);

        return toProfileResponse(user, profile);
    }

    private ProfileResponse toProfileResponse(User user, UserProfile profile) {
        return new ProfileResponse(
                user.getUserId(),
                user.getEmail(),
                user.getCreatedAt(),
                profile.getFirstName(),
                profile.getLastName()
        );
    }
}