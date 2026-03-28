package com.itsm.backend.problem;

import org.springframework.stereotype.Component;

@Component
public class ProblemMapper {

    public ProblemResponse toResponse(Problem problem) {
        if (problem == null) return null;
        
        return ProblemResponse.builder()
                .id(problem.getId())
                .title(problem.getTitle())
                .description(problem.getDescription())
                .rootCause(problem.getRootCause())
                .workaround(problem.getWorkaround())
                .status(problem.getStatus())
                .priority(problem.getPriority())
                .urgency(problem.getUrgency())
                .impact(problem.getImpact())
                .category(problem.getCategory())
                .resolution(problem.getResolution())
                .assignedGroup(problem.getAssignedGroup())
                .createdAt(problem.getCreatedAt())
                .resolvedAt(problem.getResolvedAt())
                .closedAt(problem.getClosedAt())
                .companyId(problem.getCompany() != null ? problem.getCompany().getCompanyId() : null)
                .build();
    }
}
