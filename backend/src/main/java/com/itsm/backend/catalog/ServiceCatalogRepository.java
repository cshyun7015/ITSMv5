package com.itsm.backend.catalog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceCatalogRepository extends JpaRepository<ServiceCatalog, Long> {
    List<ServiceCatalog> findByIsPublishedTrue();
    List<ServiceCatalog> findByTenant_TenantIdAndIsPublishedTrue(String tenantId);

    @Query("SELECT c FROM ServiceCatalog c WHERE " +
           "(:search IS NULL OR LOWER(c.catalogName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.category) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:tenantId IS NULL OR c.tenant.tenantId = :tenantId)")
    Page<ServiceCatalog> findBySearch(@Param("search") String search, @Param("tenantId") String tenantId, Pageable pageable);
}
