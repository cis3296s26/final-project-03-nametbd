package com.talentstack.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record JobPreferencesRequest(
        @Size(max = 45) String keyWords,
        @Size(max = 45) String location,
        @Min(0) @Max(2147483647) Integer distance,
        @Min(0) @Max(2147483647) Integer salaryMin,
        @Min(0) @Max(2147483647) Integer salaryMax,
        @Size(max = 45) String contractType,
        @Min(0) @Max(2147483647) Integer maxDaysOld
) {
}