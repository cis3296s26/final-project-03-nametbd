package com.talentstack.api.repo;

/**
 * NotificationRepository provides persistence access for Notification entities.
 *
 * It includes a query method that returns the latest 50 notifications in descending
 * created-time/id order for API delivery.
 */

import com.talentstack.api.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findTop50ByOrderByCreatedAtDescNotificationIdDesc();
}