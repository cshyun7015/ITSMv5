package com.itsm.backend.request;

import com.itsm.backend.tenant.UserRepository;
import com.itsm.backend.catalog.ServiceCatalogRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class RequestController {

    private final ServiceRequestRepository requestRepository;
    private final ServiceCatalogRepository catalogRepository;
    private final UserRepository userRepository;

    public RequestController(ServiceRequestRepository requestRepository, ServiceCatalogRepository catalogRepository, UserRepository userRepository) {
        this.requestRepository = requestRepository;
        this.catalogRepository = catalogRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<ServiceRequest> getRequests(@RequestParam String userId) {
        return requestRepository.findByRequester_UserId(userId);
    }

    @PostMapping
    public ServiceRequest createRequest(@RequestBody Map<String, Object> payload) {
        ServiceRequest req = new ServiceRequest();
        
        Long catalogId = Long.valueOf(payload.get("catalogId").toString());
        String userId = payload.get("requesterId").toString();
        
        req.setCatalog(catalogRepository.findById(catalogId).orElseThrow());
        req.setRequester(userRepository.findById(userId).orElseThrow());
        req.setTenant(req.getRequester().getTenant());
        
        req.setTitle(payload.get("title").toString());
        req.setDescription(payload.getOrDefault("description", "").toString());
        req.setFormData(payload.get("formData").toString());
        
        req.setStatus("REQ_STATUS_OPEN");
        req.setPriority(payload.getOrDefault("priority", "Medium").toString());
        req.setCreatedAt(LocalDateTime.now());
        
        return requestRepository.save(req);
    }
}
