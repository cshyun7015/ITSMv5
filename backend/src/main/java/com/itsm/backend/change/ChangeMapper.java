package com.itsm.backend.change;

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
                .testPlan(changeRequest.getTestPlan())
                .changeType(changeRequest.getChangeType())
                .status(changeRequest.getStatus())
                .risk(changeRequest.getRisk())
                .priority(changeRequest.getPriority())
                .assignedGroup(changeRequest.getAssignedGroup())
                .plannedStart(changeRequest.getPlannedStart())
                .plannedEnd(changeRequest.getPlannedEnd())
                .actualStart(changeRequest.getActualStart())
                .actualEnd(changeRequest.getActualEnd())
                .reviewNotes(changeRequest.getReviewNotes())
                .createdAt(changeRequest.getCreatedAt())
                .updatedAt(changeRequest.getUpdatedAt())
                .build();
    }
}
