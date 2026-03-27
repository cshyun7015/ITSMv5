package com.itsm.backend.incident.dto;

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
    private Long assetId;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
