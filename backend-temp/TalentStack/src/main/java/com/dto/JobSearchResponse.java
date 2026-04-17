package com.talentstack.api.dto;

import java.util.List;

public record JobSearchResponse(
        int count,
        List<JobListingResponse> jobs
) {
}