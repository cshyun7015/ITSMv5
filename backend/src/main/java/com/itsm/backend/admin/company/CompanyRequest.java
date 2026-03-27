package com.itsm.backend.admin.company;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyRequest {
    private String companyId;
    private String companyName;
    private String tier;
    private Boolean isActive;
}
