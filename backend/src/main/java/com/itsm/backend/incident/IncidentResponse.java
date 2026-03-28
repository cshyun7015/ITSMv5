package com.itsm.backend.incident;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class IncidentResponse {
    private Long id;
    private String companyId;
    private String reporterId;
    private String assigneeId;
    private String title;
    private String description;
    private String status;
    private String priority;
    private String impact;
    private String urgency;
    private String category;
    private String subcategory;
    private String source;
    private String assignedGroup;
    private String resolutionCode;
    private String resolutionDescription;
    private Long assetId;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
}
