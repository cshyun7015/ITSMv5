package com.itsm.backend.request;

import com.itsm.backend.auth.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RequestController {

    private final ServiceRequestService requestService;

    // --- User Endpoints ---

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

    // --- Admin/Agent Endpoints ---

    @GetMapping("/admin/list")
    public Page<ServiceRequest> getAllRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String tenantId) {
        
        String[] sortParts = sort.split(",");
        Sort sortObj = Sort.by(Sort.Direction.fromString(sortParts[1]), sortParts[0]);
        Pageable pageable = PageRequest.of(page, size, sortObj);
        
        // Security: If not system admin, might want to force tenantId to current user's tenant
        // For now, let's allow filtration
        return requestService.getAllRequests(search, status, tenantId, pageable);
    }

    @GetMapping("/admin/{id}")
    public ServiceRequest getRequestDetail(@PathVariable Long id) {
        return requestService.getRequest(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
    }

    @PatchMapping("/admin/{id}")
    public ServiceRequest updateRequest(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return requestService.updateRequest(id, updates);
    }

    @DeleteMapping("/admin/{id}")
    public void deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
    }
}
