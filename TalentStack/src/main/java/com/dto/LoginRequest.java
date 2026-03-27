package com.talentstack.api.dto;

/**
 * LoginRequest models the JSON body expected by the login endpoint.
 *
 * Bean validation annotations enforce that callers provide a syntactically valid email
 * and a bounded password length before authentication logic runs.
 */

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank @Email @Size(max = 254) String email,
        @NotBlank @Size(min = 8, max = 128) String password
) {}