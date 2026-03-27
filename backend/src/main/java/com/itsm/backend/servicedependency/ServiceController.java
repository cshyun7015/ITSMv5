package com.itsm.backend.servicedependency;

import com.itsm.backend.auth.SecurityUtils;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    public ServiceRequestController(ServiceRequestService serviceRequestService) {
        this.serviceRequestService = serviceRequestService;
    }

    @GetMapping
    public List<ServiceRequest> getServices() {
        String companyId = SecurityUtils.getCurrentCompanyId();
        return serviceRequestService.getServicesByCompany(companyId);
    }

    @PostMapping
    public ServiceRequest createService(@RequestBody ServiceRequest serviceRequest) {
        String companyId = SecurityUtils.getCurrentCompanyId();
        return serviceRequestService.createService(serviceRequest, companyId);
    }

    @GetMapping("/{id}/dependencies")
    public List<ServiceDependency> getDependencies(@PathVariable Long id) {
        return serviceRequestService.getDependencies(id);
    }

    @PostMapping("/{id}/dependencies")
    public void updateDependencies(@PathVariable Long id, @RequestBody List<Long> assetIds) {
        serviceRequestService.updateDependencies(id, assetIds);
    }

    @GetMapping("/bia/{assetId}")
    public List<ServiceRequest> getImpactedServices(@PathVariable Long assetId) {
        return serviceRequestService.getImpactedServices(assetId);
    }
}
