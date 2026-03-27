package com.itsm.backend.request.repository;

import com.itsm.backend.request.entity.ServiceRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByRequester_UserId(String userId);
    
    Page<ServiceRequest> findByCompany_CompanyId(String companyId, Pageable pageable);

    long countByStatus(String status);
    long countByCompany_CompanyIdAndStatus(String companyId, String status);
}
