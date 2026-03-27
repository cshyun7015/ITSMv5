package com.itsm.backend.incident;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByCompanyIdOrderByCreatedAtDesc(String companyId);
    long countByCompanyIdAndStatus(String companyId, String status);
    long countByStatus(String status);       // admin: all companys
    long countByStatusNot(String status);    // active incidents
    long countByCompanyIdAndStatusNot(String companyId, String status); // per-company active
    List<Incident> findAllByOrderByCreatedAtDesc();
}
