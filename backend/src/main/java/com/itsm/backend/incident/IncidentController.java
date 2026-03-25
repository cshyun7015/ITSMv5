package com.itsm.backend.incident;

import com.itsm.backend.auth.SecurityUtils;
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

    private final IncidentService incidentService;
    private final IncidentRepository incidentRepository;
    private final SecurityUtils securityUtils;

    public IncidentController(IncidentService incidentService, IncidentRepository incidentRepository) {
        this.incidentService = incidentService;
        this.incidentRepository = incidentRepository;
        this.securityUtils = new SecurityUtils(); // Actually it has static methods
    }

    @GetMapping
    public List<Incident> getIncidents() {
        // Server-side tenant isolation
        String tenantId = SecurityUtils.getCurrentTenantId();
        return incidentRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);
    }

    @PostMapping
    public Incident createIncident(@RequestBody Map<String, Object> payload) {
        String reporterId = SecurityUtils.getCurrentUserId();
        return incidentService.createIncident(
            reporterId,
            payload.get("title").toString(),
            payload.getOrDefault("description", "").toString(),
            payload.getOrDefault("priority", "Medium").toString(),
            payload.getOrDefault("impact", "Individual").toString()
        );
    }

    @PatchMapping("/{id}/status")
    public Incident updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String tenantId = SecurityUtils.getCurrentTenantId();
        Incident inc = incidentRepository.findById(id).orElseThrow();
        // Security: ensure user can only update their own tenant's incidents
        if (!tenantId.equals(inc.getTenantId())) {
            throw new SecurityException("Access denied");
        }
        inc.setStatus(payload.get("status"));
        if ("INC_RESOLVED".equals(payload.get("status"))) {
            inc.setResolvedAt(LocalDateTime.now());
        }
        return incidentRepository.save(inc);
    }
}
