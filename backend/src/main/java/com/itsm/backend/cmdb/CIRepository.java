package com.itsm.backend.cmdb;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CIRepository extends JpaRepository<ConfigurationItem, Long> {
    List<ConfigurationItem> findByTenant_TenantId(String tenantId);
    List<ConfigurationItem> findByTenant_TenantIdAndType(String tenantId, String type);
}
