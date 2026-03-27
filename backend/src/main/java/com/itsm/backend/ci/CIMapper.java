package com.itsm.backend.ci;

import org.springframework.stereotype.Component;

@Component
public class CIMapper {
    public CIResponse toResponse(CI ci) {
        if (ci == null) return null;
        return CIResponse.builder()
                .id(ci.getId())
                .companyId(ci.getCompanyId())
                .name(ci.getName())
                .type(ci.getType())
                .status(ci.getStatus())
                .model(ci.getModel())
                .location(ci.getLocation())
                .specifications(ci.getSpecifications())
                .createdAt(ci.getCreatedAt())
                .updatedAt(ci.getUpdatedAt())
                .build();
    }
}
