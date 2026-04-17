package com.talentstack.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UpdateApplicationStatusRequest(
        @NotBlank @Pattern(regexp = "SAVED|APPLIED|INTERVIEW|OFFER|REJECTED|WITHDRAWN", message = "invalid application status")
        String applicationStatus
) {
}