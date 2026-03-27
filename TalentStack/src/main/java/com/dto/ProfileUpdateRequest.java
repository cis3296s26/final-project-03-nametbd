package com.talentstack.api.dto;

/**
 * ProfileUpdateRequest represents editable profile/account fields for profile updates.
 *
 * Validation constraints ensure update requests include non-empty, properly sized values
 * for email and both name fields.
 */

import jakarta.validation.constraints.*;

public record ProfileUpdateRequest(
        @NotBlank @Email @Size(max = 254) String email,
        @NotBlank @Size(max = 80) String firstName,
        @NotBlank @Size(max = 80) String lastName
) {}