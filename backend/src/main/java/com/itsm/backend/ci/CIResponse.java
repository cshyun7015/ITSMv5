package com.itsm.backend.ci.dto;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class CIResponse {
    private Long id;
    private String companyId;
    private String name;
    private String type;
    private String status;
    private String model;
    private String location;
    private String specifications;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
