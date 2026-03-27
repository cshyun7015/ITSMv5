package com.itsm.backend.dashboard;

import com.itsm.backend.auth.SecurityUtils;
import com.itsm.backend.incident.IncidentRepository;
import com.itsm.backend.servicerequest.ServiceRequestRepository;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final ServiceRequestRepository requestRepository;
    private final IncidentRepository incidentRepository;

    public DashboardController(ServiceRequestRepository requestRepository, IncidentRepository incidentRepository) {
        this.requestRepository = requestRepository;
        this.incidentRepository = incidentRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        String companyId = SecurityUtils.getCurrentCompanyId();
        String role = SecurityUtils.getCurrentRole();
        boolean isAdmin = "ROLE_ADMIN".equals(role);

        long openTickets, inProgress, resolved, activeIncidents;

        if (isAdmin) {
            // MSP Admin: 전체 테넌트 합산
            openTickets      = requestRepository.countByStatus("REQ_STATUS_OPEN");
            inProgress       = requestRepository.countByStatus("REQ_STATUS_IN_PROGRESS");
            resolved         = requestRepository.countByStatus("REQ_STATUS_RESOLVED");
            activeIncidents  = incidentRepository.countByStatusNot("INC_CLOSED");
        } else {
            // 일반 사용자: 자신이 속한 테넌트만
            openTickets      = requestRepository.countByCompany_CompanyIdAndStatus(companyId, "REQ_STATUS_OPEN");
            inProgress       = requestRepository.countByCompany_CompanyIdAndStatus(companyId, "REQ_STATUS_IN_PROGRESS");
            resolved         = requestRepository.countByCompany_CompanyIdAndStatus(companyId, "REQ_STATUS_RESOLVED");
            activeIncidents  = incidentRepository.countByCompanyIdAndStatusNot(companyId, "INC_CLOSED");
        }

        long total = openTickets + inProgress + resolved;
        double sla = total == 0 ? 100.0 : Math.round((resolved / (double) total) * 1000.0) / 10.0;

        return Map.of(
            "openTickets",       openTickets,
            "inProgressTickets", inProgress,
            "resolvedTickets",   resolved,
            "activeIncidents",   activeIncidents,
            "slaCompliance",     sla + "%"
        );
    }
}
