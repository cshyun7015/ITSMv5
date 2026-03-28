package com.itsm.backend.servicecatalog;

import com.itsm.backend.auth.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/catalogs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
public class ServiceCatalogAdminController {

    private final ServiceCatalogService catalogService;

    @GetMapping
    public Page<ServiceCatalogResponse> getCatalogs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String companyId,
            Pageable pageable) {
        
        String currentRole = SecurityUtils.getCurrentRole();
        String currentCompany = SecurityUtils.getCurrentCompanyId();

        // If not ROLE_ADMIN, restricted to their own company
        if (!"ROLE_ADMIN".equals(currentRole)) {
            companyId = currentCompany;
        }

        return catalogService.getServiceCatalogsForAdmin(search, companyId, pageable);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceCatalogResponse createServiceCatalog(@RequestBody CreateServiceCatalogDTO dto) {
        String currentCompanyId = SecurityUtils.getCurrentCompanyId();
        return catalogService.createServiceCatalog(dto, currentCompanyId);
    }

    @PatchMapping("/{id}")
    public ServiceCatalogResponse updateServiceCatalog(@PathVariable Long id, @RequestBody CreateServiceCatalogDTO dto) {
        return catalogService.updateServiceCatalog(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteServiceCatalog(@PathVariable Long id) {
        catalogService.deleteServiceCatalog(id);
    }
}
