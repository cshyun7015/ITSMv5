package com.itsm.backend.ci.controller;

import com.itsm.backend.auth.SecurityUtils;
import com.itsm.backend.ci.dto.CIResponse;
import com.itsm.backend.ci.entity.ConfigurationItem;
import com.itsm.backend.ci.service.CIService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ci")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CIController {

    private final CIService ciService;

    @GetMapping
    public List<CIResponse> getCIs() {
        String role = SecurityUtils.getCurrentRole();
        String companyId = SecurityUtils.getCurrentCompanyId();

        if ("ROLE_ADMIN".equals(role)) {
            return ciService.getAllCIs();
        } else {
            return ciService.getCIsByCompany(companyId);
        }
    }

    @PostMapping
    public CIResponse createCI(@RequestBody ConfigurationItem ci) {
        String companyId = SecurityUtils.getCurrentCompanyId();
        return ciService.createCI(ci, companyId);
    }
}
