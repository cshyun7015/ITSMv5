package com.itsm.backend.servicecatalog;

import com.itsm.backend.auth.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/catalogs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class ServiceCatalogAdminController {

    private final ServiceCatalogService catalogService;

    @GetMapping
    public Page<ServiceCatalogResponse> getCatalogs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String companyId,
            @PageableDefault(size = 10, sort = "catalogName") Pageable pageable) {
        
        String currentRole = SecurityUtils.getCurrentRole();
        String currentCompany = SecurityUtils.getCurrentCompanyId();
        log.info("[ADMIN CATALOG] Fetching catalogs search: '{}', initial companyId: {}, role: {}, current session company: {}", 
                 search, companyId, currentRole, currentCompany);

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
