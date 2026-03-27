package com.itsm.backend.release.mapper;

import com.itsm.backend.release.entity.Release;
import com.itsm.backend.release.dto.ReleaseResponse;
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
                .targetDate(release.getTargetDate())
                .createdAt(release.getCreatedAt())
                .updatedAt(release.getUpdatedAt())
                .build();
    }
}
