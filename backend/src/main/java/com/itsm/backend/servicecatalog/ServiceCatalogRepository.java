package com.itsm.backend.servicecatalog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceCatalogRepository extends JpaRepository<ServiceCatalog, Long> {

    @EntityGraph(attributePaths = {"company", "serviceOwner"})
    List<ServiceCatalog> findByIsPublishedTrue();

    @EntityGraph(attributePaths = {"company", "serviceOwner"})
    List<ServiceCatalog> findByCompany_CompanyIdAndIsPublishedTrue(String companyId);

    @EntityGraph(attributePaths = {"company", "serviceOwner"})
    java.util.Optional<ServiceCatalog> findById(Long id);

    @EntityGraph(attributePaths = {"company", "serviceOwner"})
    @Query("SELECT c FROM ServiceCatalog c WHERE " +
           "(:search IS NULL OR LOWER(c.catalogName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.category) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:companyId IS NULL OR c.company.companyId = :companyId)")
    Page<ServiceCatalog> findBySearch(@Param("search") String search, @Param("companyId") String companyId, Pageable pageable);
}
