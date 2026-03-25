package com.itsm.backend.request;

import com.itsm.backend.auth.SecurityUtils;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class RequestController {

    private final ServiceRequestService requestService;

    public RequestController(ServiceRequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping
    public List<ServiceRequest> getRequests() {
        String userId = SecurityUtils.getCurrentUserId();
        return requestService.getRequestsForUser(userId);
    }

    @PostMapping
    public ServiceRequest createRequest(@RequestBody Map<String, Object> payload) {
        String userId = SecurityUtils.getCurrentUserId();
        return requestService.createRequest(userId, payload);
    }
}
