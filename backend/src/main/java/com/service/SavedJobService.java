package com.talentstack.api.service;

import com.talentstack.api.dto.SaveJobRequest;
import com.talentstack.api.dto.SavedJobResponse;
import com.talentstack.api.model.SavedJob;
import com.talentstack.api.model.User;
import com.talentstack.api.repo.SavedJobRepository;
import com.talentstack.api.repo.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SavedJobService {

    private static final String DEFAULT_STATUS = "SAVED";

    private final SavedJobRepository savedJobRepository;
    private final UserRepository userRepository;

    public SavedJobService(SavedJobRepository savedJobRepository, UserRepository userRepository) {
        this.savedJobRepository = savedJobRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public SavedJobResponse saveJob(Long userId, SaveJobRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        SavedJob savedJob = findExisting(userId, request.id()).orElseGet(SavedJob::new);
        savedJob.setUser(user);
        savedJob.setExternalJobId(request.id());
        savedJob.setTitle(request.title().trim());
        savedJob.setCompany(trimToNull(request.company()));
        savedJob.setLocation(trimToNull(request.location()));
        savedJob.setRedirectUrl(trimToNull(request.redirectUrl()));
        savedJob.setSource(request.source().trim());

        if (savedJob.getApplicationStatus() == null) {
            savedJob.setApplicationStatus(DEFAULT_STATUS);
        }
        if (request.applicationStatus() != null && !request.applicationStatus().isBlank()) {
            savedJob.setApplicationStatus(request.applicationStatus().trim());
        }

        SavedJob persisted = savedJobRepository.save(savedJob);
        return toResponse(persisted);
    }

    public List<SavedJobResponse> getSavedJobs(Long userId) {
        return savedJobRepository.findByUserUserIdOrderBySavedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public SavedJobResponse updateApplicationStatus(Long userId, Long savedJobId, String applicationStatus) {
        SavedJob savedJob = savedJobRepository.findById(savedJobId)
                .orElseThrow(() -> new IllegalArgumentException("Saved job not found: " + savedJobId));

        if (!savedJob.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Saved job not found: " + savedJobId);
        }

        savedJob.setApplicationStatus(applicationStatus.trim());
        return toResponse(savedJobRepository.save(savedJob));
    }

    private java.util.Optional<SavedJob> findExisting(Long userId, String externalJobId) {
        if (externalJobId == null || externalJobId.isBlank()) {
            return java.util.Optional.empty();
        }
        return savedJobRepository.findByUserUserIdAndExternalJobId(userId, externalJobId.trim());
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private SavedJobResponse toResponse(SavedJob savedJob) {
        return new SavedJobResponse(
                savedJob.getSavedJobId(),
                savedJob.getExternalJobId(),
                savedJob.getTitle(),
                savedJob.getCompany(),
                savedJob.getLocation(),
                savedJob.getRedirectUrl(),
                savedJob.getSource(),
                savedJob.getApplicationStatus(),
                savedJob.getSavedAt()
        );
    }
}