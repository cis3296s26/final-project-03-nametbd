package com.talentstack.api.repo;

/**
 * UserProfileRepository provides CRUD persistence operations for UserProfile entities.
 *
 * It relies on Spring Data JPA-generated behavior for profile lookups and writes keyed
 * by user id.
 */

import com.talentstack.api.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
}