package com.itsm.backend.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser_UserIdOrderByCreatedAtDesc(String userId);
    long countByUser_UserIdAndIsReadFalse(String userId);
}
