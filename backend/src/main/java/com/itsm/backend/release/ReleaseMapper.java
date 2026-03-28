package com.itsm.backend.release;

import org.springframework.stereotype.Component;

@Component
public class ReleaseMapper {
    public ReleaseResponse toResponse(Release release) {
        if (release == null) return null;
        return ReleaseResponse.builder()
                .id(release.getId())
                .companyId(release.getCompanyId())
                .title(release.getTitle())
                .description(release.getDescription())
                .status(release.getStatus())
                .releaseType(release.getReleaseType())
                .version(release.getVersion())
                .buildNumber(release.getBuildNumber())
                .packageUrl(release.getPackageUrl())
                .deploymentMethod(release.getDeploymentMethod())
                .backoutPlan(release.getBackoutPlan())
                .testEvidenceUrl(release.getTestEvidenceUrl())
                .releaseNotes(release.getReleaseNotes())
                .targetDate(release.getTargetDate())
                .createdAt(release.getCreatedAt())
                .updatedAt(release.getUpdatedAt())
                .build();
    }
}
