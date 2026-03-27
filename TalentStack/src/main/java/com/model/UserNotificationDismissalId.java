package com.talentstack.api.model;

/**
 * UserNotificationDismissalId is the composite key for user notification dismissals.
 *
 * It combines user id and notification id and supplies equality/hash semantics required
 * by JPA when embedding the key inside UserNotificationDismissal.
 */


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UserNotificationDismissalId implements Serializable {

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "notification_id")
    private Long notificationId;

    public UserNotificationDismissalId() {
    }

    public UserNotificationDismissalId(Long userId, Long notificationId) {
        this.userId = userId;
        this.notificationId = notificationId;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getNotificationId() {
        return notificationId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserNotificationDismissalId that = (UserNotificationDismissalId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(notificationId, that.notificationId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, notificationId);
    }
}