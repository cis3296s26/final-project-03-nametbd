package com.talentstack.api.controller;

/**
 * NotificationController serves notification retrieval and dismissal endpoints.
 *
 * It reads the authenticated user id from the session, returns 401 for unauthenticated
 * access, and delegates notification filtering/persistence behavior to NotificationService.
 */

import com.talentstack.api.dto.NotificationResponse;
import com.talentstack.api.service.NotificationService;
import jakarta.validation.constraints.Positive;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@Validated
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(notificationService.getVisibleNotifications(userId));
    }

    @PostMapping("/{notificationId}/dismiss")
    public ResponseEntity<Void> dismissNotification(@PathVariable @Positive Long notificationId, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        notificationService.dismissNotification(userId, notificationId);
        return ResponseEntity.ok().build();
    }
}
