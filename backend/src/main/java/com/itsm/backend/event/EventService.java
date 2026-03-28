package com.itsm.backend.event;

import com.itsm.backend.incident.Incident;
import com.itsm.backend.incident.IncidentService;
import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.company.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final IncidentService incidentService;
    private final CompanyRepository companyRepository;
    private final EventMapper eventMapper;

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAllByOrderByTimestampDesc().stream()
                .map(eventMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getEventsByCompany(String companyId) {
        return eventRepository.findByCompany_CompanyIdOrderByTimestampDesc(companyId).stream()
                .map(eventMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @SuppressWarnings("unchecked")
    public void processWebhook(Map<String, Object> payload) {
        // Simple Grafana Webhook Parsing
        List<Map<String, Object>> alerts = (List<Map<String, Object>>) payload.get("alerts");
        if (alerts == null) return;

        for (Map<String, Object> alert : alerts) {
            Map<String, Object> labels = (Map<String, Object>) alert.get("labels");
            Map<String, Object> annotations = (Map<String, Object>) alert.get("annotations");

            String alertName = labels.getOrDefault("alertname", "Unknown Alert").toString();
            String severity = labels.getOrDefault("severity", "info").toString();
            String status = alert.getOrDefault("status", "firing").toString();
            String summary = annotations.getOrDefault("summary", "").toString();
            String description = annotations.getOrDefault("description", "").toString();
            String instance = labels.getOrDefault("instance", "N/A").toString();

            Event event = new Event();
            event.setAlertName(alertName);
            event.setSeverity(severity);
            event.setStatus(status);
            event.setDescription(summary + " " + description);
            event.setInstance(instance);
            event.setSource("Grafana");
            event.setTimestamp(LocalDateTime.now());

            // Default to 'system' company for now
            Company systemCompany = companyRepository.findById("system").orElse(null);
            event.setCompany(systemCompany);

            // Auto-Incident Creation for Critical Alerts
            if ("critical".equalsIgnoreCase(severity) && "firing".equalsIgnoreCase(status)) {
                try {
                    // For auto-creation, we use 'admin' as the reporter
                    Incident incident = incidentService.createSimpleIncident(
                        "admin",
                        "[Event Auto-Generated] " + alertName,
                        "Source: Grafana\nInstance: " + instance + "\nDetails: " + description,
                        "High",
                        "System"
                     );
                    event.setLinkedIncidentId(incident.getId());
                } catch (Exception e) {
                    // Log error but continue saving event
                    System.err.println("Failed to auto-create incident from event: " + e.getMessage());
                }
            }

            eventRepository.save(event);
        }
    }
}
