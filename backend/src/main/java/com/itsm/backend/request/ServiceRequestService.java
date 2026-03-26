package com.itsm.backend.request;

import com.itsm.backend.catalog.ServiceCatalog;
import com.itsm.backend.catalog.ServiceCatalogRepository;
import com.itsm.backend.tenant.User;
import com.itsm.backend.tenant.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServiceRequestService {

    private final ServiceRequestRepository repository;
    private final UserRepository userRepository;
    private final ServiceCatalogRepository catalogRepository;

    public List<ServiceRequest> getRequestsForUser(String userId) {
        return repository.findByRequester_UserId(userId);
    }

    public Page<ServiceRequest> getAllRequests(String search, String status, String tenantId, Pageable pageable) {
        if (tenantId != null && !tenantId.isEmpty()) {
            return repository.findByTenant_TenantId(tenantId, pageable);
        }
        return repository.findAll(pageable);
    }

    @Transactional
    public ServiceRequest createRequest(String userId, Map<String, Object> payload) {
        User requester = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Long catalogId = Long.valueOf(payload.get("catalogId").toString());
        ServiceCatalog catalog = catalogRepository.findById(catalogId)
                .orElseThrow(() -> new RuntimeException("Catalog not found"));

        ServiceRequest sr = new ServiceRequest();
        sr.setRequester(requester);
        sr.setTenant(requester.getTenant());
        sr.setCatalog(catalog);
        sr.setTitle(payload.getOrDefault("title", catalog.getCatalogName() + " 요청").toString());
        sr.setDescription(payload.getOrDefault("description", "").toString());
        sr.setFormData(payload.getOrDefault("formData", "{}").toString());
        sr.setStatus("OPEN");
        sr.setPriority(payload.getOrDefault("priority", "MEDIUM").toString());
        
        return repository.save(sr);
    }

    @Transactional
    public ServiceRequest updateRequest(Long id, Map<String, Object> updates) {
        ServiceRequest sr = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (updates.containsKey("status")) {
            String newStatus = updates.get("status").toString();
            sr.setStatus(newStatus);
            if ("RESOLVED".equals(newStatus) || "CLOSED".equals(newStatus)) {
                sr.setResolvedAt(LocalDateTime.now());
            }
        }
        if (updates.containsKey("priority")) sr.setPriority(updates.get("priority").toString());
        if (updates.containsKey("resolution")) sr.setResolution(updates.get("resolution").toString());
        if (updates.containsKey("assigneeId")) {
            String assigneeId = updates.get("assigneeId").toString();
            User assignee = userRepository.findById(assigneeId)
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            sr.setAssignee(assignee);
        }
        if (updates.containsKey("title")) sr.setTitle(updates.get("title").toString());
        if (updates.containsKey("description")) sr.setDescription(updates.get("description").toString());

        return repository.save(sr);
    }

    @Transactional
    public void deleteRequest(Long id) {
        repository.deleteById(id);
    }

    public Optional<ServiceRequest> getRequest(Long id) {
        return repository.findById(id);
    }
}
