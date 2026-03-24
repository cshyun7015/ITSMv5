package com.itsm.backend.request;

import com.itsm.backend.auth.SecurityUtils;
import com.itsm.backend.tenant.UserRepository;
import com.itsm.backend.catalog.ServiceCatalogRepository;
import com.itsm.backend.notification.NotificationService;
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
    private final NotificationService notificationService;

    public RequestController(ServiceRequestRepository requestRepository, ServiceCatalogRepository catalogRepository, UserRepository userRepository, NotificationService notificationService) {
        this.requestRepository = requestRepository;
        this.catalogRepository = catalogRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<ServiceRequest> getRequests() {
        // Server-side: only return requests for the authenticated user
        String userId = SecurityUtils.getCurrentUserId();
        return requestRepository.findByRequester_UserId(userId);
    }

    @PostMapping
    public ServiceRequest createRequest(@RequestBody Map<String, Object> payload) {
        // Server-side: get the real userId from JWT, ignore any client-supplied value
        String userId = SecurityUtils.getCurrentUserId();
        var requester = userRepository.findById(userId).orElseThrow();

        ServiceRequest req = new ServiceRequest();
        Long catalogId = Long.valueOf(payload.get("catalogId").toString());
        req.setCatalog(catalogRepository.findById(catalogId).orElseThrow());
        req.setRequester(requester);
        req.setTenant(requester.getTenant());
        req.setTitle(payload.get("title").toString());
        req.setDescription(payload.getOrDefault("description", "").toString());
        req.setFormData(payload.get("formData").toString());
        req.setStatus("REQ_STATUS_OPEN");
        req.setPriority(payload.getOrDefault("priority", "Medium").toString());
        req.setCreatedAt(LocalDateTime.now());

        ServiceRequest saved = requestRepository.save(req);

        notificationService.sendNotification(
            requester,
            "서비스 요청 접수 완료",
            "요청 '" + saved.getTitle() + "' 이(가) 성공적으로 접수되었습니다. (ID: " + saved.getId() + ")",
            "SUCCESS"
        );

        return saved;
    }
}
