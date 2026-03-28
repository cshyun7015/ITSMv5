package com.itsm.backend.release;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class ReleaseResponse {
    private Long id;
    private String companyId;
    private String title;
    private String description;
    private String status;
    private String releaseType;
    private String version;
    private String buildNumber;
    private String packageUrl;
    private String deploymentMethod;
    private String backoutPlan;
    private String testEvidenceUrl;
    private String releaseNotes;
    private LocalDateTime targetDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
