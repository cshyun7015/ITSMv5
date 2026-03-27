package com.itsm.backend.sla;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class SLAResponse {
    private Long id;
    private String companyId;
    private String serviceName;
    private Double targetValue;
    private Double actualValue;
    private String unit;
    private String period;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
