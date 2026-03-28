package com.itsm.backend.servicerequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    
    @Override
    @EntityGraph(attributePaths = {"company", "catalog", "requester", "assignee", "requestValues", "requestValues.field"})
    Optional<ServiceRequest> findById(Long id);

    @EntityGraph(attributePaths = {"company", "catalog", "requester", "assignee"})
    Page<ServiceRequest> findByCompany_CompanyId(String companyId, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"company", "catalog", "requester", "assignee"})
    Page<ServiceRequest> findAll(Pageable pageable);

    List<ServiceRequest> findByRequester_UserId(String userId);

    long countByStatus(String status);
    long countByCompany_CompanyIdAndStatus(String companyId, String status);
}
