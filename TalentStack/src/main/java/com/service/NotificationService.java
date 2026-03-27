package com.talentstack.api.service;

/**
 * NotificationService encapsulates notification visibility and dismissal behavior.
 *
 * It loads the most recent notifications, filters out items the current user previously
 * dismissed, maps visible entities to DTOs, and records new dismissals.
 */

import com.talentstack.api.dto.NotificationResponse;
import com.talentstack.api.model.Notification;
import com.talentstack.api.model.UserNotificationDismissal;
import com.talentstack.api.model.UserNotificationDismissalId;
import com.talentstack.api.repo.NotificationRepository;
import com.talentstack.api.repo.UserNotificationDismissalRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserNotificationDismissalRepository dismissalRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserNotificationDismissalRepository dismissalRepository
    ) {
        this.notificationRepository = notificationRepository;
        this.dismissalRepository = dismissalRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getVisibleNotifications(Long userId) {
        List<Notification> latest = notificationRepository.findTop50ByOrderByCreatedAtDescNotificationIdDesc();

        List<Long> ids = latest.stream()
                .map(Notification::getNotificationId)
                .toList();

        if (ids.isEmpty()) {
            return List.of();
        }

        Set<Long> dismissed = dismissalRepository
                .findByIdUserIdAndIdNotificationIdIn(userId, ids)
                .stream()
                .map(row -> row.getId().getNotificationId())
                .collect(Collectors.toSet());

        return latest.stream()
                .filter(n -> !dismissed.contains(n.getNotificationId()))
                .map(n -> new NotificationResponse(
                        n.getNotificationId(),
                        n.getTitle(),
                        n.getMessage(),
                        n.getCreatedAt()
                ))
                .toList();
    }

    @Transactional
    public void dismissNotification(Long userId, Long notificationId) {
        dismissalRepository.save(new UserNotificationDismissal(new UserNotificationDismissalId(userId, notificationId)));
    }
}