package com.itsm.backend.request.dto;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class ServiceRequestResponse {
    private Long id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private String resolution;
    private String formData;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    
    private RequesterInfo requester;
    private AssigneeInfo assignee;
    private CompanyInfo company;
    private ServiceCatalogInfo catalog;

    @Getter @Builder
    public static class RequesterInfo {
        private String userId;
        private String userName;
        private String email;
    }

    @Getter @Builder
    public static class AssigneeInfo {
        private String userId;
        private String userName;
    }

    @Getter @Builder
    public static class CompanyInfo {
        private String id;
        private String companyName;
    }

    @Getter @Builder
    public static class ServiceCatalogInfo {
        private Long id;
        private String catalogName;
        private String category;
        private String icon;
    }
}
