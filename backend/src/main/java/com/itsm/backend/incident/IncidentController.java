package com.itsm.backend.incident.controller;

import com.itsm.backend.auth.SecurityUtils;
import com.itsm.backend.incident.dto.IncidentResponse;
import com.itsm.backend.incident.entity.Incident;
import com.itsm.backend.incident.mapper.IncidentMapper;
import com.itsm.backend.incident.repository.IncidentRepository;
import com.itsm.backend.incident.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IncidentController {

    private final IncidentService incidentService;
    private final IncidentRepository incidentRepository;
    private final IncidentMapper incidentMapper;

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

    @PostMapping
    public IncidentResponse createIncident(@RequestBody Map<String, Object> payload) {
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
    public IncidentResponse updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String companyId = SecurityUtils.getCurrentCompanyId();
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        // Security check
        if (!"ROLE_ADMIN".equals(SecurityUtils.getCurrentRole()) && !companyId.equals(incident.getCompanyId())) {
            throw new SecurityException("Access denied");
        }

        incident.setStatus(payload.get("status"));
        if ("INC_RESOLVED".equals(payload.get("status"))) {
            incident.setResolvedAt(LocalDateTime.now());
        }

        return incidentMapper.toResponse(incidentRepository.save(incident));
    }
}
