package com.itsm.backend.request.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateServiceRequestDTO {
    private Long catalogId;
    private String title;
    private String description;
    private String formData;
    private String priority;
}
