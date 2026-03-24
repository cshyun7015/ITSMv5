package com.itsm.backend.dashboard;

import com.itsm.backend.request.ServiceRequestRepository;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final ServiceRequestRepository requestRepository;

    public DashboardController(ServiceRequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats(@RequestParam String tenantId) {
        long openTickets = requestRepository.countByTenant_TenantIdAndStatus(tenantId, "REQ_STATUS_OPEN");
        long inProgressTickets = requestRepository.countByTenant_TenantIdAndStatus(tenantId, "REQ_STATUS_IN_PROGRESS");
        long resolvedTickets = requestRepository.countByTenant_TenantIdAndStatus(tenantId, "REQ_STATUS_RESOLVED");

        return Map.of(
            "openTickets", openTickets,
            "inProgressTickets", inProgressTickets,
            "resolvedTickets", resolvedTickets,
            "slaCompliance", "99.8%", // Mock layout for UI
            "activeIncidents", "0"      // Mock layout for UI
        );
    }
}
