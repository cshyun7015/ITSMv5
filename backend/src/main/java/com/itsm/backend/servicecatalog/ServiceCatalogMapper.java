package com.itsm.backend.servicecatalog;

import org.springframework.stereotype.Component;

@Component
public class ServiceCatalogMapper {

    public ServiceCatalogResponse mapToResponse(ServiceCatalog entity) {
        return ServiceCatalogResponse.builder()
            .id(entity.getId())
            .catalogName(entity.getCatalogName())
            .description(entity.getDescription())
            .category(entity.getCategory())
            .icon(entity.getIcon())
            .ownerId(entity.getServiceOwner() != null ? entity.getServiceOwner().getUserId() : null)
            .ownerName(entity.getServiceOwner() != null ? entity.getServiceOwner().getUserName() : null)
            .fulfillmentGroup(entity.getFulfillmentGroup())
            .slaHours(entity.getSlaHours())
            .estimatedCost(entity.getEstimatedCost())
            .defaultUrgency(entity.getDefaultUrgency())
            .isPublished(entity.getIsPublished())
            .company(ServiceCatalogResponse.CompanyInfo.builder()
                .companyId(entity.getCompany().getCompanyId())
                .companyName(entity.getCompany().getCompanyName())
                .build())
            .build();
    }

    public ServiceCatalog mapToEntity(CreateServiceCatalogDTO dto, com.itsm.backend.admin.company.Company company) {
        ServiceCatalog entity = new ServiceCatalog();
        entity.setCompany(company);
        entity.setCatalogName(dto.getCatalogName());
        entity.setDescription(dto.getDescription());
        entity.setCategory(dto.getCategory());
        entity.setIcon(dto.getIcon());
        entity.setFulfillmentGroup(dto.getFulfillmentGroup());
        entity.setSlaHours(dto.getSlaHours());
        entity.setEstimatedCost(dto.getEstimatedCost());
        entity.setDefaultUrgency(dto.getDefaultUrgency());
        entity.setIsPublished(dto.getIsPublished());
        return entity;
    }
}
