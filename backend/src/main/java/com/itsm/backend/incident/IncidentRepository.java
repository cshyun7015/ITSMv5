package com.itsm.backend.incident;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByTenantIdOrderByCreatedAtDesc(String tenantId);
    long countByTenantIdAndStatus(String tenantId, String status);
}
