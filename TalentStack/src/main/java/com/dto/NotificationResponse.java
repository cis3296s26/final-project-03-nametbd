package com.talentstack.api.dto;

/**
 * NotificationResponse is the outbound DTO for notification API responses.
 *
 * It contains only the fields required by clients to render notification cards while
 * insulating API contracts from persistence entity structure.
 */

import java.time.LocalDateTime;

public record NotificationResponse(
        Long notificationId,
        String title,
        String message,
        LocalDateTime createdAt
) {
}