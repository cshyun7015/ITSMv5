package com.itsm.backend.incident.service;

import com.itsm.backend.incident.dto.IncidentResponse;
import com.itsm.backend.incident.entity.Incident;
import com.itsm.backend.incident.mapper.IncidentMapper;
import com.itsm.backend.incident.repository.IncidentRepository;
import com.itsm.backend.notification.NotificationService;
import com.itsm.backend.admin.company.entity.User;
import com.itsm.backend.company.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
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
                .orElse(null);
    }

    @Transactional
    public Incident createIncidentInternal(String reporterId, String title, String description, String priority, String impact) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + reporterId));

        Incident incident = new Incident();
        incident.setCompany(reporter.getCompany());
        incident.setCompanyId(reporter.getCompany().getCompanyId());
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

    @Transactional
    public IncidentResponse createIncident(String reporterId, String title, String description, String priority, String impact) {
        Incident saved = createIncidentInternal(reporterId, title, description, priority, impact);
        return incidentMapper.toResponse(saved);
    }

    // Temporary compatibility for auto-creation
    @Transactional
    public Incident createSimpleIncident(String reporterId, String title, String description, String priority, String impact) {
        return createIncidentInternal(reporterId, title, description, priority, impact);
    }
}
