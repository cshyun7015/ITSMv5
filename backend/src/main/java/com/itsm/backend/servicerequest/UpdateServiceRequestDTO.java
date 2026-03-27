package com.itsm.backend.servicerequest;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateServiceRequestDTO {
    private String title;
    private String description;
    private String status;
    private String priority;
    private String resolution;
    private String assigneeId;
    private String formData;
}
