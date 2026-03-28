package com.itsm.backend.servicerequest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itsm.backend.servicecatalog.CatalogField;
import com.itsm.backend.servicecatalog.CatalogFieldRepository;
import com.itsm.backend.servicecatalog.ServiceCatalog;
import com.itsm.backend.servicecatalog.ServiceCatalogRepository;
import com.itsm.backend.admin.user.User;
import com.itsm.backend.admin.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ServiceRequestService {

    private final ServiceRequestRepository repository;
    private final UserRepository userRepository;
    private final ServiceCatalogRepository catalogRepository;
    private final CatalogFieldRepository fieldRepository;
    private final ServiceRequestMapper mapper;
    private final ObjectMapper objectMapper = new ObjectMapper();

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
        sr.setStatus("OPEN");
        sr.setPriority(dto.getPriority() != null ? dto.getPriority() : "MEDIUM");
        
        ServiceRequest saved = repository.save(sr);
        
        if (dto.getFormData() != null) {
            log.debug("[REQUEST] Parsing dynamic form data: {}", dto.getFormData());
            saveRequestValues(saved, catalog, dto.getFormData());
        }
        
        return mapper.toResponse(saved);
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
        
        if (dto.getFormData() != null) {
            // Clear existing and recreate (simplistic transition)
            sr.getRequestValues().clear();
            saveRequestValues(sr, sr.getCatalog(), dto.getFormData());
        }

        return mapper.toResponse(repository.save(sr));
    }

    private void saveRequestValues(ServiceRequest sr, ServiceCatalog catalog, String formDataJson) {
        try {
            Map<String, Object> values = objectMapper.readValue(formDataJson, new TypeReference<Map<String, Object>>() {});
            List<CatalogField> fields = fieldRepository.findByCatalogOrderByFieldOrder(catalog);
            
            for (CatalogField field : fields) {
                if (values.containsKey(field.getFieldName())) {
                    RequestValue rv = new RequestValue();
                    rv.setRequest(sr);
                    rv.setField(field);
                    rv.setFieldValue(String.valueOf(values.get(field.getFieldName())));
                    sr.getRequestValues().add(rv);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse form data: " + e.getMessage());
        }
    }

    @Transactional
    public ServiceRequestResponse cancelRequest(Long id, String userId) {
        ServiceRequest sr = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (!sr.getRequester().getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Only the requester can cancel this request.");
        }
        
        if (!"OPEN".equals(sr.getStatus())) {
            throw new RuntimeException("Only requests in 'OPEN' status can be canceled.");
        }
        
        sr.setStatus("CANCELED");
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
