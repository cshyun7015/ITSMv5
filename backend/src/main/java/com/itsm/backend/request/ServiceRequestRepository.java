package com.itsm.backend.request;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    Page<ServiceRequest> findByTenant_TenantId(String tenantId, Pageable pageable);
    List<ServiceRequest> findByRequester_UserId(String userId);
    long countByTenant_TenantIdAndStatus(String tenantId, String status);
    long countByStatus(String status);
}
