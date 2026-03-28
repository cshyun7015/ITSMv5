package com.itsm.backend.sla;

import lombok.Data;

@Data
public class SlaMetricResponse {
    private Long id;
    private String name;
    private String description;
    private Double targetValue;
    private String unit;
    private Double warningThreshold;
    private Double criticalThreshold;
    private String frequency;
    private boolean isActive;
}
