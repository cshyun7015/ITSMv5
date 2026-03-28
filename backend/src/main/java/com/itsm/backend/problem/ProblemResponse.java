package com.itsm.backend.problem;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class ProblemResponse {
    private Long id;
    private String title;
    private String description;
    private String rootCause;
    private String workaround;
    private String status;
    private String priority;
    private String urgency;
    private String impact;
    private String category;
    private String resolution;
    private String assignedGroup;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    private String companyId;
}
