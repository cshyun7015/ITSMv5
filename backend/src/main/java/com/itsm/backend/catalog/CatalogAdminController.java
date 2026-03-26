package com.itsm.backend.catalog;

import com.itsm.backend.auth.SecurityUtils;
import com.itsm.backend.tenant.Tenant;
import com.itsm.backend.tenant.TenantRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/catalogs")
@CrossOrigin(origins = "*")
public class CatalogAdminController {

    private final ServiceCatalogRepository catalogRepository;
    private final TenantRepository tenantRepository;

    public CatalogAdminController(ServiceCatalogRepository catalogRepository, TenantRepository tenantRepository) {
        this.catalogRepository = catalogRepository;
        this.tenantRepository = tenantRepository;
    }

    @GetMapping
    public Page<ServiceCatalog> getCatalogs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String tenantId,
            Pageable pageable) {
        
        String currentRole = SecurityUtils.getCurrentRole();
        String currentTenant = SecurityUtils.getCurrentTenantId();

        // If not ROLE_ADMIN, restricted to their own tenant
        if (!"ROLE_ADMIN".equals(currentRole)) {
            tenantId = currentTenant;
        }

        return catalogRepository.findBySearch(search, tenantId, pageable);
    }

    @PostMapping
    public ResponseEntity<ServiceCatalog> createCatalog(@RequestBody ServiceCatalog catalog) {
        if (catalog.getTenant() == null || catalog.getTenant().getTenantId() == null) {
            String tenantId = SecurityUtils.getCurrentTenantId();
            Tenant tenant = tenantRepository.findById(tenantId).orElseThrow();
            catalog.setTenant(tenant);
        }
        return ResponseEntity.ok(catalogRepository.save(catalog));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ServiceCatalog> updateCatalog(@PathVariable Long id, @RequestBody ServiceCatalog updates) {
        ServiceCatalog existing = catalogRepository.findById(id).orElseThrow();
        
        if (updates.getCatalogName() != null) existing.setCatalogName(updates.getCatalogName());
        if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
        if (updates.getCategory() != null) existing.setCategory(updates.getCategory());
        if (updates.getIcon() != null) existing.setIcon(updates.getIcon());
        if (updates.getFormSchema() != null) existing.setFormSchema(updates.getFormSchema());
        if (updates.getIsPublished() != null) existing.setIsPublished(updates.getIsPublished());

        return ResponseEntity.ok(catalogRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCatalog(@PathVariable Long id) {
        catalogRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
