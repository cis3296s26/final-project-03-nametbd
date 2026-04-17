package com.talentstack.api.repo;

import com.talentstack.api.model.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByUserUserIdOrderBySavedAtDesc(Long userId);

    Optional<SavedJob> findByUserUserIdAndExternalJobId(Long userId, String externalJobId);
}