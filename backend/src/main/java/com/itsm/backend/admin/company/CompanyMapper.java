package com.itsm.backend.admin.company;

import org.springframework.stereotype.Component;

@Component
public class CompanyMapper {
    public CompanyResponse toResponse(Company company) {
        return CompanyResponse.builder()
                .companyId(company.getCompanyId())
                .companyName(company.getCompanyName())
                .tier(company.getTier())
                .isActive(company.getIsActive())
                .createdAt(company.getCreatedAt())
                .build();
    }
}
