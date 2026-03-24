package com.itsm.backend.request;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByTenant_TenantId(String tenantId);
    List<ServiceRequest> findByRequester_UserId(String userId);
    long countByTenant_TenantIdAndStatus(String tenantId, String status);
}
