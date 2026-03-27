package com.talentstack.api.model;

import jakarta.persistence.*;

/**
 * UserNotificationDismissal stores when a user has dismissed a notification.
 *
 * It uses an embedded composite key (user + notification) and retains a database-managed
 * dismissed timestamp for audit and filtering behavior.
 */

import java.time.LocalDateTime;

@Entity
@Table(name = "user_notification_dismissals")
public class UserNotificationDismissal {

    @EmbeddedId
    private UserNotificationDismissalId id;

    @Column(name = "dismissed_at", insertable = false, updatable = false)
    private LocalDateTime dismissedAt;

    public UserNotificationDismissal() {
    }

    public UserNotificationDismissal(UserNotificationDismissalId id) {
        this.id = id;
    }

    public UserNotificationDismissalId getId() {
        return id;
    }

    public LocalDateTime getDismissedAt() {
        return dismissedAt;
    }
}