package com.talentstack.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record JobSearchRequest(
        @Valid @NotNull JobPreferencesRequest preferences,
        @Min(1) Integer page,
        @Min(1) @Max(50) Integer pageSize
) {
}