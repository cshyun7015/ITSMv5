package com.itsm.backend.event;

import com.itsm.backend.incident.Incident;
import com.itsm.backend.incident.IncidentService;
import com.itsm.backend.tenant.Tenant;
import com.itsm.backend.tenant.TenantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final IncidentService incidentService;
    private final TenantRepository tenantRepository;

    public EventService(EventRepository eventRepository, IncidentService incidentService, TenantRepository tenantRepository) {
        this.eventRepository = eventRepository;
        this.incidentService = incidentService;
        this.tenantRepository = tenantRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAllByOrderByTimestampDesc();
    }

    @Transactional
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

            // Default to 'system' tenant for now
            Tenant systemTenant = tenantRepository.findById("system").orElse(null);
            event.setTenant(systemTenant);

            // Auto-Incident Creation for Critical Alerts
            if ("critical".equalsIgnoreCase(severity) && "firing".equalsIgnoreCase(status)) {
                try {
                    // For auto-creation, we use 'admin' as the reporter
                    Incident incident = incidentService.createIncident(
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
