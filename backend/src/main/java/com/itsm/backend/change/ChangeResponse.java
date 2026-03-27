package com.itsm.backend.change;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class ChangeResponse {
    private Long id;
    private String companyId;
    private String requesterId;
    private String title;
    private String description;
    private String changeReason;
    private String riskAssessment;
    private String impactAnalysis;
    private String implementationPlan;
    private String rollbackPlan;
    private String changeType;
    private String status;
    private String risk;
    private String priority;
    private LocalDateTime plannedStart;
    private LocalDateTime plannedEnd;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
