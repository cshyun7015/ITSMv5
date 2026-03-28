package com.itsm.backend.servicecatalog;

import com.itsm.backend.auth.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/catalogs")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ServiceCatalogController {

    private final ServiceCatalogService catalogService;

    @GetMapping
    public List<ServiceCatalogResponse> getServiceCatalogs() {
        String role = SecurityUtils.getCurrentRole();
        String companyId = SecurityUtils.getCurrentCompanyId();
        log.info("[CATALOG] Fetching published catalogs. Role: {}, Company: {}", role, companyId);
        return catalogService.getPublishedServiceCatalogs(companyId, role);
    }

    @GetMapping("/{id}")
    public ServiceCatalogResponse getServiceCatalog(@PathVariable Long id) {
        log.info("[CATALOG] Fetching catalog details for ID: {}", id);
        return catalogService.getServiceCatalog(id);
    }
}
