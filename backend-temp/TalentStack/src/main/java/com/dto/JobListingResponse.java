package com.talentstack.api.dto;

public record JobListingResponse(
        String id,
        String title,
        String company,
        String location,
        String description,
        String redirectUrl,
        Integer salaryMin,
        Integer salaryMax,
        String contractType,
        String created
) {
}