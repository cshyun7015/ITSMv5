package com.itsm.backend.servicecatalog;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateServiceCatalogDTO {
    private String catalogName;
    private String description;
    private String category;
    private String icon;
    private String formSchema;
    private Boolean isPublished;
    private String companyId;
}
