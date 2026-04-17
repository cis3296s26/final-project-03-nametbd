package com.talentstack.api.dto;

/**
 * ProfileResponse is the API response payload for profile reads and profile updates.
 *
 * It packages a user's core account fields (id, email, created timestamp) together with
 * the editable profile name fields so controller/service layers can return one normalized
 * object to the frontend.
 */

import java.time.LocalDateTime;

public record ProfileResponse(
        Long userId,
        String email,
        LocalDateTime createdAt,
        String firstName,
        String lastName,
        Integer age,
        String keyWords,
        String location,
        Integer distance,
        Integer salaryMin,
        Integer salaryMax,
        String contractType,
        Integer maxDaysOld
) {}