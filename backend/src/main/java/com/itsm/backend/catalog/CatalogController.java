package com.itsm.backend.catalog;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/catalog")
@CrossOrigin(origins = "*")
public class CatalogController {

    private final ServiceCatalogRepository catalogRepository;

    public CatalogController(ServiceCatalogRepository catalogRepository) {
        this.catalogRepository = catalogRepository;
    }

    @GetMapping
    public List<ServiceCatalog> getCatalogs(@RequestParam String tenantId) {
        return catalogRepository.findByTenant_TenantIdAndIsPublishedTrue(tenantId);
    }
    
    @GetMapping("/{id}")
    public ServiceCatalog getCatalogDetails(@PathVariable Long id) {
        return catalogRepository.findById(id).orElseThrow(() -> new RuntimeException("Catalog not found"));
    }
}
