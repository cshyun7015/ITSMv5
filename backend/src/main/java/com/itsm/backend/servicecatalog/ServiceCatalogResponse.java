package com.itsm.backend.servicecatalog;

import lombok.Builder;
import lombok.Getter;

@Getter @Builder @lombok.Setter
public class ServiceCatalogResponse {
    private Long id;
    private String catalogName;
    private String description;
    private String category;
    private String icon;
    private String ownerId;
    private String ownerName;
    private String fulfillmentGroup;
    private Integer slaHours;
    private java.math.BigDecimal estimatedCost;
    private String defaultUrgency;
    private Boolean isPublished;
    @Builder.Default
    private java.util.List<FieldResponse> fields = new java.util.ArrayList<>();
    
    @Getter @Builder
    public static class FieldResponse {
        private Long id;
        private String fieldName;
        private String fieldLabel;
        private String fieldType;
        private boolean isRequired;
        private int fieldOrder;
        private String fieldOptions;
    }
    private CompanyInfo company;

    @Getter @Builder
    public static class CompanyInfo {
        private String companyId;
        private String companyName;
    }
}
