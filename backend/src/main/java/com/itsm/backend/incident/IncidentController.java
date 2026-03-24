package com.itsm.backend.incident;

import com.itsm.backend.tenant.UserRepository;
import com.itsm.backend.notification.NotificationService;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "*")
public class IncidentController {

    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public IncidentController(IncidentRepository incidentRepository, UserRepository userRepository, NotificationService notificationService) {
        this.incidentRepository = incidentRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<Incident> getIncidents(@RequestParam String tenantId) {
        return incidentRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);
    }

    @PostMapping
    public Incident createIncident(@RequestBody Map<String, Object> payload) {
        String reporterId = payload.get("reporterId").toString();
        var reporter = userRepository.findById(reporterId).orElseThrow();

        Incident incident = new Incident();
        incident.setTenant(reporter.getTenant());
        incident.setTenantId(reporter.getTenant().getTenantId());
        incident.setReporter(reporter);
        incident.setReporterId(reporterId);
        incident.setTitle(payload.get("title").toString());
        incident.setDescription(payload.getOrDefault("description", "").toString());
        incident.setStatus("INC_OPEN");
        incident.setPriority(payload.getOrDefault("priority", "Medium").toString());
        incident.setImpact(payload.getOrDefault("impact", "Individual").toString());
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

    @PatchMapping("/{id}/status")
    public Incident updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Incident inc = incidentRepository.findById(id).orElseThrow();
        inc.setStatus(payload.get("status"));
        if ("INC_RESOLVED".equals(payload.get("status"))) {
            inc.setResolvedAt(LocalDateTime.now());
        }
        return incidentRepository.save(inc);
    }
}
