package com.talentstack.api.service;

import com.talentstack.api.dto.ProfileResponse;
import com.talentstack.api.dto.ProfileIdentityUpdateRequest;
import com.talentstack.api.dto.JobPreferencesRequest;
import com.talentstack.api.dto.JobPreferencesResponse;
import com.talentstack.api.model.User;
import com.talentstack.api.model.UserProfile;
import com.talentstack.api.repo.UserProfileRepository;
import com.talentstack.api.repo.UserRepository;
import com.talentstack.api.util.InputSanitizer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDataService {

    private final UserRepository userRepo;
    private final UserProfileRepository profileRepo;

    public UserDataService(UserRepository userRepo, UserProfileRepository profileRepo) {
        this.userRepo = userRepo;
        this.profileRepo = profileRepo;
    }

    public ProfileResponse getProfile(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        UserProfile profile = profileRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found: " + userId));

        return toProfileResponse(user, profile);
    }

    public JobPreferencesResponse getJobPreferences(Long userId) {
        UserProfile profile = profileRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found: " + userId));

        return toJobPreferencesResponse(profile);
    }

    @Transactional
    public ProfileResponse updateProfile(Long userId, ProfileIdentityUpdateRequest request) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        UserProfile profile = profileRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found: " + userId));


        user.setEmail(InputSanitizer.sanitizeEmail(request.email()));

        profile.setFirstName(InputSanitizer.sanitizeName(request.firstName()));
        profile.setLastName(InputSanitizer.sanitizeName(request.lastName()));
        profile.setAge(request.age());

        userRepo.save(user);
        profileRepo.save(profile);

        return toProfileResponse(user, profile);
    }

    @Transactional
    public JobPreferencesResponse updateJobPreferences(Long userId, JobPreferencesRequest request) {
        UserProfile profile = profileRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found: " + userId));

        validateSalaryRange(request.salaryMin(), request.salaryMax());

        profile.setKeyWords(request.keyWords());
        profile.setLocation(request.location());
        profile.setDistance(request.distance());
        profile.setSalaryMin(request.salaryMin());
        profile.setSalaryMax(request.salaryMax());
        profile.setContractType(request.contractType());
        profile.setMaxDaysOld(request.maxDaysOld());

        profileRepo.save(profile);

        return toJobPreferencesResponse(profile);
    }

    private ProfileResponse toProfileResponse(User user, UserProfile profile) {
        return new ProfileResponse(
                user.getUserId(),
                user.getEmail(),
                user.getCreatedAt(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getAge(),
                profile.getKeyWords(),
                profile.getLocation(),
                profile.getDistance(),
                profile.getSalaryMin(),
                profile.getSalaryMax(),
                profile.getContractType(),
                profile.getMaxDaysOld()
        );
    }

    private JobPreferencesResponse toJobPreferencesResponse(UserProfile profile) {
        return new JobPreferencesResponse(
                profile.getKeyWords(),
                profile.getLocation(),
                profile.getDistance(),
                profile.getSalaryMin(),
                profile.getSalaryMax(),
                profile.getContractType(),
                profile.getMaxDaysOld()
        );
    }

    private void validateSalaryRange(Integer min, Integer max) {
        if (min == null || max == null) return;

        if (min < 0 || max < 0) {
            throw new IllegalArgumentException("Salary must be non-negative");
        }

        if (min > max) {
            throw new IllegalArgumentException("salaryMin cannot be greater than salaryMax");
        }
    }
}