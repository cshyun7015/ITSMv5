package com.itsm.backend.servicecatalog.controller;

import com.itsm.backend.auth.SecurityUtils;
import com.itsm.backend.servicecatalog.dto.ServiceCatalogResponse;
import com.itsm.backend.servicecatalog.service.ServiceCatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/catalogs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ServiceCatalogController {

    private final ServiceCatalogService catalogService;

    @GetMapping
    public List<ServiceCatalogResponse> getServiceCatalogs() {
        String role = SecurityUtils.getCurrentRole();
        String companyId = SecurityUtils.getCurrentCompanyId();
        return catalogService.getPublishedServiceCatalogs(companyId, role);
    }

    @GetMapping("/{id}")
    public ServiceCatalogResponse getServiceCatalog(@PathVariable Long id) {
        return catalogService.getServiceCatalog(id);
    }
}
