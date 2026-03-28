package com.itsm.backend.servicerequest;

import com.itsm.backend.admin.user.User;
import com.itsm.backend.admin.company.Company;
import com.itsm.backend.servicecatalog.ServiceCatalog;
import org.springframework.stereotype.Component;

@Component
public class ServiceRequestMapper {

    public ServiceRequestResponse toResponse(ServiceRequest sr) {
        if (sr == null) return null;
        
        return ServiceRequestResponse.builder()
                .id(sr.getId())
                .title(sr.getTitle())
                .description(sr.getDescription())
                .status(sr.getStatus())
                .priority(sr.getPriority())
                .resolution(sr.getResolution())
                .requestValues(sr.getRequestValues().stream()
                    .map(rv -> ServiceRequestResponse.RequestValueResponse.builder()
                        .fieldName(rv.getField() != null ? rv.getField().getFieldName() : null)
                        .fieldLabel(rv.getField() != null ? rv.getField().getFieldLabel() : null)
                        .fieldValue(rv.getFieldValue())
                        .build())
                    .toList())
                .createdAt(sr.getCreatedAt())
                .updatedAt(sr.getUpdatedAt())
                .resolvedAt(sr.getResolvedAt())
                .requester(mapRequester(sr.getRequester()))
                .assignee(mapAssignee(sr.getAssignee()))
                .company(mapCompany(sr.getCompany()))
                .catalog(mapServiceCatalog(sr.getCatalog()))
                .build();
    }

    private ServiceRequestResponse.RequesterInfo mapRequester(User user) {
        if (user == null) return null;
        return ServiceRequestResponse.RequesterInfo.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .build();
    }

    private ServiceRequestResponse.AssigneeInfo mapAssignee(User user) {
        if (user == null) return null;
        return ServiceRequestResponse.AssigneeInfo.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .build();
    }

    private ServiceRequestResponse.CompanyInfo mapCompany(Company company) {
        if (company == null) return null;
        return ServiceRequestResponse.CompanyInfo.builder()
                .id(company.getCompanyId())
                .companyName(company.getCompanyName())
                .build();
    }

    private ServiceRequestResponse.ServiceCatalogInfo mapServiceCatalog(ServiceCatalog catalog) {
        if (catalog == null) return null;
        return ServiceRequestResponse.ServiceCatalogInfo.builder()
                .id(catalog.getId())
                .catalogName(catalog.getCatalogName())
                .category(catalog.getCategory())
                .icon(catalog.getIcon())
                .build();
    }
}
