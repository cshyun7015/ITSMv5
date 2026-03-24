package com.itsm.backend.catalog;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceCatalogRepository extends JpaRepository<ServiceCatalog, Long> {
    List<ServiceCatalog> findByTenant_TenantIdAndIsPublishedTrue(String tenantId);
}
