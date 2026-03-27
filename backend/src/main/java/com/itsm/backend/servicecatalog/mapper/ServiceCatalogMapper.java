package com.itsm.backend.servicecatalog.mapper;

import com.itsm.backend.servicecatalog.entity.ServiceCatalog;
import com.itsm.backend.servicecatalog.dto.ServiceCatalogResponse;
import com.itsm.backend.company.Company;
import org.springframework.stereotype.Component;

@Component
public class ServiceCatalogMapper {

    public ServiceCatalogResponse toResponse(ServiceCatalog catalog) {
        if (catalog == null) return null;
        
        return ServiceCatalogResponse.builder()
                .id(catalog.getId())
                .catalogName(catalog.getCatalogName())
                .description(catalog.getDescription())
                .category(catalog.getCategory())
                .icon(catalog.getIcon())
                .formSchema(catalog.getFormSchema())
                .isPublished(catalog.getIsPublished())
                .company(mapCompany(catalog.getCompany()))
                .build();
    }

    private ServiceCatalogResponse.CompanyInfo mapCompany(Company company) {
        if (company == null) return null;
        return ServiceCatalogResponse.CompanyInfo.builder()
                .companyId(company.getCompanyId())
                .companyName(company.getCompanyName())
                .build();
    }
}
