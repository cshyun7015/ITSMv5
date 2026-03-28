package com.itsm.backend.incident;

import com.itsm.backend.auth.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IncidentController {

    private final IncidentService incidentService;

    @GetMapping
    public List<IncidentResponse> getIncidents() {
        String role = SecurityUtils.getCurrentRole();
        String companyId = SecurityUtils.getCurrentCompanyId();

        if ("ROLE_ADMIN".equals(role)) {
            return incidentService.getAllIncidents();
        } else {
            return incidentService.getIncidentsByCompany(companyId);
        }
    }

    @GetMapping("/{id}")
    public IncidentResponse getIncident(@PathVariable Long id) {
        return incidentService.getIncident(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IncidentResponse createIncident(@RequestBody Map<String, Object> payload) {
        String reporterId = SecurityUtils.getCurrentUserId();
        return incidentService.createIncident(
            reporterId,
            (String) payload.get("title"),
            (String) payload.getOrDefault("description", ""),
            (String) payload.getOrDefault("urgency", "Medium"),
            (String) payload.getOrDefault("impact", "Medium"),
            (String) payload.getOrDefault("category", "General"),
            (String) payload.getOrDefault("source", "Portal")
        );
    }

    @PatchMapping("/{id}")
    public IncidentResponse updateIncident(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        // Simple security check (Admins can do anything, others only their own company? 
        // We'll trust the Service for now or add explicit check if needed)
        return incidentService.updateIncident(id, payload);
    }

    @PatchMapping("/{id}/status")
    public IncidentResponse updateStatus(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        return incidentService.updateIncident(id, payload);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteIncident(@PathVariable Long id) {
        incidentService.deleteIncident(id);
    }
}
