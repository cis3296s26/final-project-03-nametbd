package com.talentstack.api.dto;

import java.time.LocalDateTime;

public record SavedJobResponse(
        Long savedJobId,
        String id,
        String title,
        String company,
        String location,
        String redirectUrl,
        String source,
        String applicationStatus,
        LocalDateTime savedAt
) {
}
