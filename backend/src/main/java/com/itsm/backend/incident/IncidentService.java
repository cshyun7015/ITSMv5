package com.itsm.backend.incident;

import com.itsm.backend.notification.NotificationService;
import com.itsm.backend.tenant.User;
import com.itsm.backend.tenant.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public IncidentService(IncidentRepository incidentRepository, UserRepository userRepository, NotificationService notificationService) {
        this.incidentRepository = incidentRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Incident createIncident(String reporterId, String title, String description, String priority, String impact) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + reporterId));

        Incident incident = new Incident();
        incident.setTenant(reporter.getTenant());
        incident.setTenantId(reporter.getTenant().getTenantId());
        incident.setReporter(reporter);
        incident.setReporterId(reporterId);
        incident.setTitle(title);
        incident.setDescription(description);
        incident.setStatus("INC_OPEN");
        incident.setPriority(priority != null ? priority : "Medium");
        incident.setImpact(impact != null ? impact : "Individual");
        incident.setCreatedAt(LocalDateTime.now());

        Incident saved = incidentRepository.save(incident);

        notificationService.sendNotification(
                reporter,
                "장애 신고 접수 완료",
                "[" + saved.getPriority() + "] '" + saved.getTitle() + "' 장애가 접수되었습니다. (INC#" + saved.getId() + ")",
                "WARNING"
        );

        return saved;
    }
}
