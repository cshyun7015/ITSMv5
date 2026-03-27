package com.itsm.backend.request.service;

import com.itsm.backend.servicecatalog.entity.ServiceCatalog;
import com.itsm.backend.servicecatalog.repository.ServiceCatalogRepository;
import com.itsm.backend.request.dto.CreateServiceRequestDTO;
import com.itsm.backend.request.dto.ServiceRequestResponse;
import com.itsm.backend.request.dto.UpdateServiceRequestDTO;
import com.itsm.backend.request.entity.ServiceRequest;
import com.itsm.backend.request.mapper.ServiceRequestMapper;
import com.itsm.backend.request.repository.ServiceRequestRepository;
import com.itsm.backend.company.entity.User;
import com.itsm.backend.company.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceRequestService {

    private final ServiceRequestRepository repository;
    private final UserRepository userRepository;
    private final ServiceCatalogRepository catalogRepository;
    private final ServiceRequestMapper mapper;

    public List<ServiceRequestResponse> getRequestsForUser(String userId) {
        return repository.findByRequester_UserId(userId).stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    public Page<ServiceRequestResponse> getAllRequests(String search, String status, String companyId, Pageable pageable) {
        Page<ServiceRequest> requests;
        if (companyId != null && !companyId.isEmpty()) {
            requests = repository.findByCompany_CompanyId(companyId, pageable);
        } else {
            requests = repository.findAll(pageable);
        }
        return requests.map(mapper::toResponse);
    }

    @Transactional
    public ServiceRequestResponse createRequest(String userId, CreateServiceRequestDTO dto) {
        User requester = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        ServiceCatalog catalog = catalogRepository.findById(dto.getCatalogId())
                .orElseThrow(() -> new RuntimeException("Catalog not found"));

        ServiceRequest sr = new ServiceRequest();
        sr.setRequester(requester);
        sr.setCompany(requester.getCompany());
        sr.setCatalog(catalog);
        sr.setTitle(dto.getTitle() != null ? dto.getTitle() : catalog.getCatalogName() + " 요청");
        sr.setDescription(dto.getDescription());
        sr.setFormData(dto.getFormData() != null ? dto.getFormData() : "{}");
        sr.setStatus("OPEN");
        sr.setPriority(dto.getPriority() != null ? dto.getPriority() : "MEDIUM");
        
        return mapper.toResponse(repository.save(sr));
    }

    @Transactional
    public ServiceRequestResponse updateRequest(Long id, UpdateServiceRequestDTO dto) {
        ServiceRequest sr = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (dto.getStatus() != null) {
            sr.setStatus(dto.getStatus());
            if ("RESOLVED".equals(dto.getStatus()) || "CLOSED".equals(dto.getStatus())) {
                sr.setResolvedAt(LocalDateTime.now());
            }
        }
        if (dto.getPriority() != null) sr.setPriority(dto.getPriority());
        if (dto.getResolution() != null) sr.setResolution(dto.getResolution());
        if (dto.getAssigneeId() != null) {
            User assignee = userRepository.findById(dto.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            sr.setAssignee(assignee);
        }
        if (dto.getTitle() != null) sr.setTitle(dto.getTitle());
        if (dto.getDescription() != null) sr.setDescription(dto.getDescription());
        if (dto.getFormData() != null) sr.setFormData(dto.getFormData());

        return mapper.toResponse(repository.save(sr));
    }

    @Transactional
    public void deleteRequest(Long id) {
        repository.deleteById(id);
    }

    public ServiceRequestResponse getById(Long id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Request not found"));
    }
}
