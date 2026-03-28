package com.itsm.backend.sla;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SlaResponse {
    private Long id;
    private String name;
    private String description;
    private String customerName;
    private SlaStatus status;
    private String serviceHours;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String companyId;
    private List<SlaMetricResponse> metrics;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
