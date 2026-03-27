package com.itsm.backend.servicecatalog.dto;

import lombok.Builder;
import lombok.Getter;

@Getter @Builder
public class ServiceCatalogResponse {
    private Long id;
    private String catalogName;
    private String description;
    private String category;
    private String icon;
    private String formSchema;
    private Boolean isPublished;
    private CompanyInfo company;

    @Getter @Builder
    public static class CompanyInfo {
        private String companyId;
        private String companyName;
    }
}
