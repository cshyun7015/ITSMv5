package com.itsm.backend.change.service;

import com.itsm.backend.change.dto.ChangeResponse;
import com.itsm.backend.change.entity.Change;
import com.itsm.backend.change.mapper.ChangeMapper;
import com.itsm.backend.change.repository.ChangeRepository;
import com.itsm.backend.notification.NotificationService;
import com.itsm.backend.company.Company;
import com.itsm.backend.company.CompanyRepository;
import com.itsm.backend.admin.company.entity.User;
import com.itsm.backend.company.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChangeService {

    private final ChangeRepository changeRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final ChangeMapper changeMapper;

    public List<ChangeResponse> getAllChanges() {
        return changeRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(changeMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ChangeResponse> getChangesByCompany(String companyId) {
        return changeRepository.findByCompanyIdOrderByCreatedAtDesc(companyId).stream()
                .map(changeMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ChangeResponse getChange(Long id) {
        return changeRepository.findById(id)
                .map(changeMapper::toResponse)
                .orElse(null);
    }

    @Transactional
    public ChangeResponse createChange(Change cr, String companyId, String requesterId) {
        Company company = companyRepository.findById(companyId).orElseThrow();
        User requester = userRepository.findById(requesterId).orElseThrow();
        
        cr.setCompany(company);
        cr.setCompanyId(companyId);
        cr.setRequester(requester);
        cr.setRequesterId(requesterId);
        if (cr.getStatus() == null) cr.setStatus("CHG_DRAFT");
        
        Change saved = changeRepository.save(cr);
        
        notificationService.sendNotification(
            requester,
            "변경 요청 등록",
            "새로운 변경 요청 '" + saved.getTitle() + "'이(가) 등록되었습니다. (ID: " + saved.getId() + ")",
            "INFO"
        );
        
        return changeMapper.toResponse(saved);
    }

    @Transactional
    public ChangeResponse updateStatus(Long id, String status, String companyId, String role) {
        Change cr = changeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Change request not found"));
        
        // Security check
        if (!"ROLE_ADMIN".equals(role) && !cr.getCompanyId().equals(companyId)) {
            throw new RuntimeException("Access denied");
        }
        
        cr.setStatus(status);
        Change updated = changeRepository.save(cr);
        
        if (cr.getRequester() != null) {
            notificationService.sendNotification(
                cr.getRequester(),
                "변경 요청 상태 변경",
                "변경 요청 '" + cr.getTitle() + "'의 상태가 " + status + "(으)로 변경되었습니다.",
                "INFO"
            );
        }
        
        return changeMapper.toResponse(updated);
    }
}
