package com.itsm.backend.change;

import com.itsm.backend.notification.NotificationService;
import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.company.CompanyRepository;
import com.itsm.backend.admin.user.User;
import com.itsm.backend.admin.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
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
                .orElseThrow(() -> new RuntimeException("Change request not found: " + id));
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
    public ChangeResponse updateChange(Long id, Change updates) {
        Change cr = changeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Change request not found"));
        
        if (updates.getTitle() != null) cr.setTitle(updates.getTitle());
        if (updates.getDescription() != null) cr.setDescription(updates.getDescription());
        if (updates.getChangeReason() != null) cr.setChangeReason(updates.getChangeReason());
        if (updates.getRiskAssessment() != null) cr.setRiskAssessment(updates.getRiskAssessment());
        if (updates.getImpactAnalysis() != null) cr.setImpactAnalysis(updates.getImpactAnalysis());
        if (updates.getImplementationPlan() != null) cr.setImplementationPlan(updates.getImplementationPlan());
        if (updates.getRollbackPlan() != null) cr.setRollbackPlan(updates.getRollbackPlan());
        if (updates.getTestPlan() != null) cr.setTestPlan(updates.getTestPlan());
        
        if (updates.getChangeType() != null) cr.setChangeType(updates.getChangeType());
        if (updates.getRisk() != null) cr.setRisk(updates.getRisk());
        if (updates.getPriority() != null) cr.setPriority(updates.getPriority());
        if (updates.getAssignedGroup() != null) cr.setAssignedGroup(updates.getAssignedGroup());
        
        if (updates.getPlannedStart() != null) cr.setPlannedStart(updates.getPlannedStart());
        if (updates.getPlannedEnd() != null) cr.setPlannedEnd(updates.getPlannedEnd());
        if (updates.getActualStart() != null) cr.setActualStart(updates.getActualStart());
        if (updates.getActualEnd() != null) cr.setActualEnd(updates.getActualEnd());
        
        if (updates.getReviewNotes() != null) cr.setReviewNotes(updates.getReviewNotes());
        
        if (updates.getStatus() != null) {
            cr.setStatus(updates.getStatus());
        }
        
        cr.setUpdatedAt(LocalDateTime.now());
        return changeMapper.toResponse(changeRepository.save(cr));
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
        cr.setUpdatedAt(LocalDateTime.now());
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

    @Transactional
    public void deleteChange(Long id) {
        changeRepository.deleteById(id);
    }
}
