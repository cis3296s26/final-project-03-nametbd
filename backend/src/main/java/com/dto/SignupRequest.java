package com.talentstack.api.dto;

/**
 * SignupRequest models the JSON payload accepted by account registration.
 *
 * Validation rules enforce required email/password/name fields and length limits so bad
 * input is rejected by framework validation before service-level persistence logic.
 */

import jakarta.validation.constraints.*;

public record SignupRequest(
        @NotBlank @Email @Size(max = 45) String email,
        @NotBlank @Size(min = 8, max = 128) String password,
        @NotBlank @Size(max = 80) String first_name,
        @NotBlank @Size(max = 80) String last_name
        ) {}