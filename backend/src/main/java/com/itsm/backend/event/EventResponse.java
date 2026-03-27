package com.itsm.backend.event;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class EventResponse {
    private Long id;
    private String alertName;
    private String status;
    private String severity;
    private String description;
    private String source;
    private String instance;
    private LocalDateTime timestamp;
    private Long linkedIncidentId;
    private String companyId;
}
