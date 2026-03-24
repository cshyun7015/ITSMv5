package com.itsm.backend.dashboard;

import com.itsm.backend.auth.SecurityUtils;
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
    public Map<String, Object> getStats() {
        String tenantId = SecurityUtils.getCurrentTenantId();
        long openTickets = requestRepository.countByTenant_TenantIdAndStatus(tenantId, "REQ_STATUS_OPEN");
        long inProgress = requestRepository.countByTenant_TenantIdAndStatus(tenantId, "REQ_STATUS_IN_PROGRESS");
        long resolved = requestRepository.countByTenant_TenantIdAndStatus(tenantId, "REQ_STATUS_RESOLVED");
        long total = openTickets + inProgress + resolved;
        double sla = total == 0 ? 100.0 : Math.round((resolved / (double) total) * 1000.0) / 10.0;
        return Map.of(
            "openTickets", openTickets,
            "inProgressTickets", inProgress,
            "resolvedTickets", resolved,
            "activeIncidents", 0,
            "slaCompliance", sla + "%"
        );
    }
}
