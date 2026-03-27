package com.itsm.backend.incident;

import org.springframework.stereotype.Component;

@Component
public class IncidentMapper {

    public IncidentResponse toResponse(Incident incident) {
        if (incident == null) return null;
        
        return IncidentResponse.builder()
                .id(incident.getId())
                .companyId(incident.getCompanyId())
                .reporterId(incident.getReporterId())
                .assigneeId(incident.getAssignee() != null ? incident.getAssignee().getUserId() : null)
                .title(incident.getTitle())
                .description(incident.getDescription())
                .status(incident.getStatus())
                .priority(incident.getPriority())
                .impact(incident.getImpact())
                .assetId(incident.getAssetId())
                .createdAt(incident.getCreatedAt())
                .resolvedAt(incident.getResolvedAt())
                .build();
    }
}
