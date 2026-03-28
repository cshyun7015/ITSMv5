package com.itsm.backend.servicerequest;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ServiceRequestRequest {
    private Long catalogId;
    private String title;
    private String description;
    private String formData;
    private String priority;
    private String requesterId;
    private String companyId;
}
