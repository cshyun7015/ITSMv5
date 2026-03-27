package com.itsm.backend.company.mapper;

import com.itsm.backend.company.dto.CompanyResponse;
import com.itsm.backend.company.entity.Company;
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
