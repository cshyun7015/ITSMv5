package com.itsm.backend.notification;

import com.itsm.backend.auth.SecurityUtils;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public List<Notification> getNotifications() {
        String userId = SecurityUtils.getCurrentUserId();
        return notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount() {
        String userId = SecurityUtils.getCurrentUserId();
        return Map.of("count", notificationRepository.countByUser_UserIdAndIsReadFalse(userId));
    }

    @PatchMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @PatchMapping("/read-all")
    public void markAllRead() {
        String userId = SecurityUtils.getCurrentUserId();
        var notifications = notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }
    @GetMapping("/debug-session")
    public Map<String, Object> debugSession() {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return Map.of("authenticated", false);
        }
        return Map.of(
            "authenticated", auth.isAuthenticated(),
            "name", auth.getName(),
            "authorities", auth.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .toList(),
            "principal", auth.getPrincipal()
        );
    }
}
