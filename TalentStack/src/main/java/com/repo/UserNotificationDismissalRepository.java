package com.talentstack.api.repo;

/**
 * UserNotificationDismissalRepository persists notification dismissal records.
 *
 * In addition to CRUD operations, it provides a derived query for fetching all dismissal
 * entries for a user within a set of notification ids.
 */

import com.talentstack.api.model.UserNotificationDismissal;
import com.talentstack.api.model.UserNotificationDismissalId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface UserNotificationDismissalRepository extends JpaRepository<UserNotificationDismissal, UserNotificationDismissalId> {
    List<UserNotificationDismissal> findByIdUserIdAndIdNotificationIdIn(Long userId, Collection<Long> notificationIds);
}
