package com.itsm.backend.servicedependency;

import com.itsm.backend.auth.SecurityUtils;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @GetMapping
    public List<Service> getServices() {
        String companyId = SecurityUtils.getCurrentCompanyId();
        return serviceService.getServicesByCompany(companyId);
    }

    @PostMapping
    public Service createService(@RequestBody Service service) {
        String companyId = SecurityUtils.getCurrentCompanyId();
        return serviceService.createService(service, companyId);
    }

    @GetMapping("/{id}/dependencies")
    public List<ServiceDependency> getDependencies(@PathVariable Long id) {
        return serviceService.getDependencies(id);
    }

    @PostMapping("/{id}/dependencies")
    public void updateDependencies(@PathVariable Long id, @RequestBody List<Long> assetIds) {
        serviceService.updateDependencies(id, assetIds);
    }

    @GetMapping("/bia/{assetId}")
    public List<Service> getImpactedServices(@PathVariable Long assetId) {
        return serviceService.getImpactedServices(assetId);
    }
}
