package com.itsm.backend.change;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChangeRequestRepository extends JpaRepository<ChangeRequest, Long> {
    List<ChangeRequest> findByTenantIdOrderByCreatedAtDesc(String tenantId);
}
