package com.talentstack.api.repo;

/**
 * UserRepository provides CRUD access to User entities.
 *
 * It includes a derived finder for unique email lookup used by signup/login flows.
 */

import com.talentstack.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}