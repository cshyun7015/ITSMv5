package com.itsm.backend.release.dto;

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
    private LocalDateTime targetDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
