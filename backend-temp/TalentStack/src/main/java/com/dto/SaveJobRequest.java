package com.talentstack.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SaveJobRequest(
        @Size(max = 120) String id,
        @NotBlank @Size(max = 255) String title,
        @Size(max = 255) String company,
        @Size(max = 255) String location,
        @Size(max = 1024) String redirectUrl,
        @NotBlank @Pattern(regexp = "SEARCH|RECOMMENDED", message = "must be SEARCH or RECOMMENDED") String source,
        @Pattern(regexp = "SAVED|APPLIED|INTERVIEW|OFFER|REJECTED|WITHDRAWN", message = "invalid application status") String applicationStatus
) {
}
