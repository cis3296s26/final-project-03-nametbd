package com.talentstack.api.model;

/**
 * Notification maps notification content persisted in the notifications table.
 *
 * It exposes identifier, title/message text, and created timestamp used by service code
 * when building API notification responses.
 */

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @Column(name = "notification_id")
    private Long notificationId;

    @Column(nullable = false, length = 45)
    private String notification_title;

    @Column(nullable = false, length = 500)
    private String notification_content;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Long getNotificationId() {
        return notificationId;
    }

    public String getTitle() {
        return notification_title;
    }

    public String getMessage() {return notification_content;}

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
