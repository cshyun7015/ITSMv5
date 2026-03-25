package com.itsm.backend.catalog;

import com.itsm.backend.auth.SecurityUtils;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/catalogs")
@CrossOrigin(origins = "*")
public class ServiceCatalogController {

    private final ServiceCatalogRepository catalogRepository;

    public ServiceCatalogController(ServiceCatalogRepository catalogRepository) {
        this.catalogRepository = catalogRepository;
    }

    @GetMapping
    public List<ServiceCatalog> getCatalogs() {
        String role = SecurityUtils.getCurrentRole();
        // ADMIN can see all catalogs across tenants (MSP view)
        if ("ROLE_ADMIN".equals(role)) {
            return catalogRepository.findByIsPublishedTrue();
        }
        String tenantId = SecurityUtils.getCurrentTenantId();
        return catalogRepository.findByTenant_TenantIdAndIsPublishedTrue(tenantId);
    }

    @GetMapping("/{id}")
    public ServiceCatalog getCatalog(@PathVariable Long id) {
        return catalogRepository.findById(id).orElseThrow();
    }
}
