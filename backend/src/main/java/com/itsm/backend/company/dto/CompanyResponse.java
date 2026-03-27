package com.itsm.backend.company.dto;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class CompanyResponse {
    private String companyId;
    private String companyName;
    private String tier;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
