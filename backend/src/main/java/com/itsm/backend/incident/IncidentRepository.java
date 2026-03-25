package com.itsm.backend.incident;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByTenantIdOrderByCreatedAtDesc(String tenantId);
    long countByTenantIdAndStatus(String tenantId, String status);
    long countByStatus(String status);       // admin: all tenants
    long countByStatusNot(String status);    // active incidents
    long countByTenantIdAndStatusNot(String tenantId, String status); // per-tenant active
}
