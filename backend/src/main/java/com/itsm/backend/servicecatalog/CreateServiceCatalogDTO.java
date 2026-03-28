package com.itsm.backend.servicecatalog;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateServiceCatalogDTO {
    private String catalogName;
    private String description;
    private String category;
    private String icon;
    private String ownerId;
    private String fulfillmentGroup;
    private Integer slaHours;
    private java.math.BigDecimal estimatedCost;
    private String defaultUrgency;
    private Boolean isPublished;
    private String companyId;
    
    private java.util.List<FieldDTO> fields;

    @Getter @Setter
    public static class FieldDTO {
        private String fieldName;
        private String fieldLabel;
        private String fieldType;
        private boolean isRequired;
        private int fieldOrder;
        private String fieldOptions;
    }
}
