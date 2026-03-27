package com.itsm.backend.servicerequest;

import com.itsm.backend.auth.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ServiceRequestController {

    private final ServiceRequestService requestService;

    // --- User Endpoints ---

    @GetMapping
    public List<ServiceRequestResponse> getRequests() {
        String userId = SecurityUtils.getCurrentUserId();
        return requestService.getRequestsForUser(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceRequestResponse createRequest(@RequestBody CreateServiceRequestDTO dto) {
        String userId = SecurityUtils.getCurrentUserId();
        return requestService.createRequest(userId, dto);
    }

    // --- Admin/Agent Endpoints ---

    @GetMapping("/admin/list")
    public Page<ServiceRequestResponse> getAllRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String companyId) {
        
        String[] sortParts = sort.split(",");
        Sort sortObj = Sort.by(Sort.Direction.fromString(sortParts[1]), sortParts[0]);
        Pageable pageable = PageRequest.of(page, size, sortObj);
        
        return requestService.getAllRequests(search, status, companyId, pageable);
    }

    @GetMapping("/admin/{id}")
    public ServiceRequestResponse getRequestDetail(@PathVariable Long id) {
        return requestService.getById(id);
    }

    @PatchMapping("/admin/{id}")
    public ServiceRequestResponse updateRequest(@PathVariable Long id, @RequestBody UpdateServiceRequestDTO dto) {
        return requestService.updateRequest(id, dto);
    }

    @DeleteMapping("/admin/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
    }
}
