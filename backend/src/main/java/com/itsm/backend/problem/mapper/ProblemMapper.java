package com.itsm.backend.problem.mapper;

import com.itsm.backend.problem.entity.Problem;
import com.itsm.backend.problem.dto.ProblemResponse;
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
                .createdAt(problem.getCreatedAt())
                .companyId(problem.getCompany() != null ? problem.getCompany().getCompanyId() : null)
                .build();
    }
}
