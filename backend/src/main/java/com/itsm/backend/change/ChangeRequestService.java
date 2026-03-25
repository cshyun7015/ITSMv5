package com.itsm.backend.change;

import com.itsm.backend.tenant.Tenant;
import com.itsm.backend.tenant.TenantRepository;
import com.itsm.backend.tenant.User;
import com.itsm.backend.tenant.UserRepository;
import com.itsm.backend.notification.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ChangeRequestService {

    private final ChangeRequestRepository changeRepository;
    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ChangeRequestService(ChangeRequestRepository changeRepository, 
                                TenantRepository tenantRepository,
                                UserRepository userRepository,
                                NotificationService notificationService) {
        this.changeRepository = changeRepository;
        this.tenantRepository = tenantRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public List<ChangeRequest> getChangesByTenant(String tenantId) {
        return changeRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);
    }

    @Transactional
    public ChangeRequest createChangeRequest(ChangeRequest cr, String tenantId, String requesterId) {
        Tenant tenant = tenantRepository.findById(tenantId).orElseThrow();
        User requester = userRepository.findById(requesterId).orElseThrow();
        
        cr.setTenant(tenant);
        cr.setTenantId(tenantId);
        cr.setRequester(requester);
        cr.setRequesterId(requesterId);
        if (cr.getStatus() == null) cr.setStatus("CHG_DRAFT");
        
        ChangeRequest saved = changeRepository.save(cr);
        
        notificationService.sendNotification(
            requester,
            "변경 요청 등록",
            "새로운 변경 요청 '" + saved.getTitle() + "'이(가) 등록되었습니다. (ID: " + saved.getId() + ")",
            "INFO"
        );
        
        return saved;
    }

    @Transactional
    public ChangeRequest updateStatus(Long id, String status, String tenantId) {
        ChangeRequest cr = changeRepository.findById(id).orElseThrow();
        if (!cr.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Access denied");
        }
        
        cr.setStatus(status);
        ChangeRequest updated = changeRepository.save(cr);
        
        if (cr.getRequester() != null) {
            notificationService.sendNotification(
                cr.getRequester(),
                "변경 요청 상태 변경",
                "변경 요청 '" + cr.getTitle() + "'의 상태가 " + status + "(으)로 변경되었습니다.",
                "INFO"
            );
        }
        
        return updated;
    }
}
