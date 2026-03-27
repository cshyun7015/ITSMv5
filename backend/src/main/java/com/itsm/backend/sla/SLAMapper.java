package com.itsm.backend.sla;

import org.springframework.stereotype.Component;

@Component
public class SLAMapper {
    public SLAResponse toResponse(SLA sla) {
        if (sla == null) return null;
        return SLAResponse.builder()
                .id(sla.getId())
                .companyId(sla.getCompanyId())
                .serviceName(sla.getServiceName())
                .targetValue(sla.getTargetValue())
                .actualValue(sla.getActualValue())
                .unit(sla.getUnit())
                .period(sla.getPeriod())
                .status(sla.getStatus())
                .createdAt(sla.getCreatedAt())
                .updatedAt(sla.getUpdatedAt())
                .build();
    }
}
