package com.itsm.backend.servicecatalog;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CatalogFieldRepository extends JpaRepository<CatalogField, Long> {
    List<CatalogField> findByCatalogOrderByFieldOrder(ServiceCatalog catalog);
}
