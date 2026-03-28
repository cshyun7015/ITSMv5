package com.itsm.backend.incident;

import com.itsm.backend.notification.NotificationService;
import com.itsm.backend.admin.user.User;
import com.itsm.backend.admin.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final IncidentMapper incidentMapper;

    public List<IncidentResponse> getAllIncidents() {
        return incidentRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(incidentMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<IncidentResponse> getIncidentsByCompany(String companyId) {
        return incidentRepository.findByCompanyIdOrderByCreatedAtDesc(companyId).stream()
                .map(incidentMapper::toResponse)
                .collect(Collectors.toList());
    }

    public IncidentResponse getIncident(Long id) {
        return incidentRepository.findById(id)
                .map(incidentMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Incident not found: " + id));
    }

    @Transactional
    public IncidentResponse createIncident(String reporterId, String title, String description, String urgency, String impact, String category, String source) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + reporterId));

        Incident incident = new Incident();
        incident.setCompany(reporter.getCompany());
        if (reporter.getCompany() != null) {
            incident.setCompanyId(reporter.getCompany().getCompanyId());
        }
        incident.setReporter(reporter);
        incident.setReporterId(reporterId);
        incident.setTitle(title);
        incident.setDescription(description);
        incident.setStatus("INC_OPEN");
        incident.setUrgency(urgency != null ? urgency : "Medium");
        incident.setImpact(impact != null ? impact : "Medium");
        incident.setCategory(category);
        incident.setSource(source != null ? source : "Portal");
        incident.setPriority(calculatePriority(incident.getUrgency(), incident.getImpact()));
        incident.setCreatedAt(LocalDateTime.now());

        Incident saved = incidentRepository.save(incident);

        notificationService.sendNotification(
                reporter,
                "장애 신고 접수 완료",
                "[" + saved.getPriority() + "] '" + saved.getTitle() + "' 장애가 접수되었습니다. (INC#" + saved.getId() + ")",
                "WARNING"
        );

        return incidentMapper.toResponse(saved);
    }

    @Transactional
    public IncidentResponse updateIncident(Long id, Map<String, Object> updates) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        if (updates.containsKey("title")) incident.setTitle((String) updates.get("title"));
        if (updates.containsKey("description")) incident.setDescription((String) updates.get("description"));
        if (updates.containsKey("status")) {
            String newStatus = (String) updates.get("status");
            incident.setStatus(newStatus);
            if ("INC_RESOLVED".equals(newStatus)) {
                incident.setResolvedAt(LocalDateTime.now());
            } else if ("INC_CLOSED".equals(newStatus)) {
                incident.setClosedAt(LocalDateTime.now());
            }
        }
        if (updates.containsKey("urgency")) incident.setUrgency((String) updates.get("urgency"));
        if (updates.containsKey("impact")) incident.setImpact((String) updates.get("impact"));
        if (updates.containsKey("category")) incident.setCategory((String) updates.get("category"));
        if (updates.containsKey("subcategory")) incident.setSubcategory((String) updates.get("subcategory"));
        if (updates.containsKey("assignedGroup")) incident.setAssignedGroup((String) updates.get("assignedGroup"));
        if (updates.containsKey("assigneeId")) {
            String assigneeId = (String) updates.get("assigneeId");
            if (assigneeId != null) {
                User assignee = userRepository.findById(assigneeId).orElse(null);
                incident.setAssignee(assignee);
            } else {
                incident.setAssignee(null);
            }
        }
        if (updates.containsKey("resolutionCode")) incident.setResolutionCode((String) updates.get("resolutionCode"));
        if (updates.containsKey("resolutionDescription")) incident.setResolutionDescription((String) updates.get("resolutionDescription"));

        // Recalculate priority if urgency or impact changed
        incident.setPriority(calculatePriority(incident.getUrgency(), incident.getImpact()));

        return incidentMapper.toResponse(incidentRepository.save(incident));
    }

    @Transactional
    public void deleteIncident(Long id) {
        incidentRepository.deleteById(id);
    }

    @Transactional
    public Incident createSimpleIncident(String reporterId, String title, String description, String priority, String impact) {
        Incident saved = createIncidentInternal(reporterId, title, description, priority, impact);
        return saved;
    }

    private Incident createIncidentInternal(String reporterId, String title, String description, String priority, String impact) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + reporterId));

        Incident incident = new Incident();
        incident.setCompany(reporter.getCompany());
        if (reporter.getCompany() != null) {
            incident.setCompanyId(reporter.getCompany().getCompanyId());
        }
        incident.setReporter(reporter);
        incident.setReporterId(reporterId);
        incident.setTitle(title);
        incident.setDescription(description);
        incident.setStatus("INC_OPEN");
        incident.setPriority(priority != null ? priority : "Medium");
        incident.setImpact(impact != null ? impact : "Medium");
        incident.setUrgency("Medium");
        incident.setCategory("General");
        incident.setSource("Monitoring");
        incident.setCreatedAt(LocalDateTime.now());

        return incidentRepository.save(incident);
    }

    private String calculatePriority(String urgency, String impact) {
        if ("High".equalsIgnoreCase(urgency) && "High".equalsIgnoreCase(impact)) return "Critical";
        if ("High".equalsIgnoreCase(urgency) || "High".equalsIgnoreCase(impact)) return "High";
        if ("Low".equalsIgnoreCase(urgency) && "Low".equalsIgnoreCase(impact)) return "Low";
        return "Medium";
    }

    // Compatibility for existing calls
    @Transactional
    public IncidentResponse createIncident(String reporterId, String title, String description, String priority, String impact) {
        return createIncident(reporterId, title, description, "Medium", impact, "General", "Manual");
    }
}
