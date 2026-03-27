package com.itsm.backend.sla.controller;

import com.itsm.backend.auth.SecurityUtils;
import com.itsm.backend.sla.dto.SLAResponse;
import com.itsm.backend.sla.entity.SLA;
import com.itsm.backend.sla.service.SLAService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/slas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SLAController {

    private final SLAService slaService;

    @GetMapping
    public List<SLAResponse> getSLAs() {
        String role = SecurityUtils.getCurrentRole();
        String companyId = SecurityUtils.getCurrentCompanyId();

        if ("ROLE_ADMIN".equals(role)) {
            return slaService.getAllSLAs();
        } else {
            return slaService.getSLAsByCompany(companyId);
        }
    }

    @PostMapping
    public SLAResponse createSLA(@RequestBody SLA sla) {
        String companyId = SecurityUtils.getCurrentCompanyId();
        return slaService.createSLARecord(sla, companyId);
    }
}
