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
        String tenantId = SecurityUtils.getCurrentTenantId();
        // MSP: return tenant-specific + system shared catalogs
        return catalogRepository.findByTenant_TenantIdAndIsPublished(tenantId, true);
    }

    @GetMapping("/{id}")
    public ServiceCatalog getCatalog(@PathVariable Long id) {
        return catalogRepository.findById(id).orElseThrow();
    }
}
