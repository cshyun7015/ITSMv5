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
    private LocalDateTime createdAt;
    private String companyId;
}
