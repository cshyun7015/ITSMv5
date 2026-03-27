package com.itsm.backend.service;

import com.itsm.backend.auth.SecurityUtils;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ItServiceController {

    private final ItServiceService itServiceService;

    public ItServiceController(ItServiceService itServiceService) {
        this.itServiceService = itServiceService;
    }

    @GetMapping
    public List<ItService> getServices() {
        String companyId = SecurityUtils.getCurrentCompanyId();
        return itServiceService.getServicesByCompany(companyId);
    }

    @PostMapping
    public ItService createService(@RequestBody ItService itService) {
        String companyId = SecurityUtils.getCurrentCompanyId();
        return itServiceService.createService(itService, companyId);
    }

    @GetMapping("/{id}/dependencies")
    public List<ServiceDependency> getDependencies(@PathVariable Long id) {
        return itServiceService.getDependencies(id);
    }

    @PostMapping("/{id}/dependencies")
    public void updateDependencies(@PathVariable Long id, @RequestBody List<Long> assetIds) {
        itServiceService.updateDependencies(id, assetIds);
    }

    @GetMapping("/bia/{assetId}")
    public List<ItService> getImpactedServices(@PathVariable Long assetId) {
        return itServiceService.getImpactedServices(assetId);
    }
}
