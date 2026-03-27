package com.itsm.backend.change.mapper;

import com.itsm.backend.change.entity.Change;
import com.itsm.backend.change.dto.ChangeResponse;
import org.springframework.stereotype.Component;

@Component
public class ChangeMapper {

    public ChangeResponse toResponse(Change changeRequest) {
        if (changeRequest == null) return null;
        
        return ChangeResponse.builder()
                .id(changeRequest.getId())
                .companyId(changeRequest.getCompanyId())
                .requesterId(changeRequest.getRequesterId())
                .title(changeRequest.getTitle())
                .description(changeRequest.getDescription())
                .changeReason(changeRequest.getChangeReason())
                .riskAssessment(changeRequest.getRiskAssessment())
                .impactAnalysis(changeRequest.getImpactAnalysis())
                .implementationPlan(changeRequest.getImplementationPlan())
                .rollbackPlan(changeRequest.getRollbackPlan())
                .changeType(changeRequest.getChangeType())
                .status(changeRequest.getStatus())
                .risk(changeRequest.getRisk())
                .priority(changeRequest.getPriority())
                .plannedStart(changeRequest.getPlannedStart())
                .plannedEnd(changeRequest.getPlannedEnd())
                .createdAt(changeRequest.getCreatedAt())
                .updatedAt(changeRequest.getUpdatedAt())
                .build();
    }
}
