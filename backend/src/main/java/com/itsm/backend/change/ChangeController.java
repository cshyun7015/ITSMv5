package com.itsm.backend.change;

import com.itsm.backend.auth.SecurityUtils;
import com.itsm.backend.tenant.UserRepository;
import com.itsm.backend.notification.NotificationService;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/changes")
@CrossOrigin(origins = "*")
public class ChangeController {

    private final ChangeRequestRepository changeRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ChangeController(ChangeRequestRepository changeRepository, UserRepository userRepository, NotificationService notificationService) {
        this.changeRepository = changeRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<ChangeRequest> getChanges() {
        String tenantId = SecurityUtils.getCurrentTenantId();
        return changeRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);
    }

    @PostMapping
    public ChangeRequest createChange(@RequestBody Map<String, Object> payload) {
        String requesterId = SecurityUtils.getCurrentUserId();
        var requester = userRepository.findById(requesterId).orElseThrow();

        ChangeRequest cr = new ChangeRequest();
        cr.setTenant(requester.getTenant());
        cr.setTenantId(requester.getTenant().getTenantId());
        cr.setRequester(requester);
        cr.setRequesterId(requesterId);
        cr.setTitle(payload.get("title").toString());
        cr.setDescription(payload.getOrDefault("description", "").toString());
        cr.setRollbackPlan(payload.getOrDefault("rollbackPlan", "").toString());
        cr.setChangeType(payload.getOrDefault("changeType", "Normal").toString());
        cr.setRisk(payload.getOrDefault("risk", "Medium").toString());
        cr.setStatus("CHG_DRAFT");
        cr.setCreatedAt(LocalDateTime.now());

        ChangeRequest saved = changeRepository.save(cr);

        notificationService.sendNotification(
            requester,
            "변경 요청 등록 완료",
            "[" + saved.getChangeType() + "] '" + saved.getTitle() + "' 변경 요청이 등록되었습니다. (CHG#" + saved.getId() + ")",
            "INFO"
        );

        return saved;
    }

    @PatchMapping("/{id}/status")
    public ChangeRequest updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String tenantId = SecurityUtils.getCurrentTenantId();
        ChangeRequest cr = changeRepository.findById(id).orElseThrow();
        if (!tenantId.equals(cr.getTenantId())) {
            throw new SecurityException("Access denied");
        }
        cr.setStatus(payload.get("status"));
        return changeRepository.save(cr);
    }
}
