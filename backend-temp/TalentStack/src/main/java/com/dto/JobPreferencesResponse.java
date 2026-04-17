package com.talentstack.api.dto;

public record JobPreferencesResponse(
        String keyWords,
        String location,
        Integer distance,
        Integer salaryMin,
        Integer salaryMax,
        String contractType,
        Integer maxDaysOld
) {
}