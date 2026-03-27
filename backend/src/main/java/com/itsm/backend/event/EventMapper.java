package com.itsm.backend.event;

import org.springframework.stereotype.Component;

@Component
public class EventMapper {

    public EventResponse toResponse(Event event) {
        if (event == null) return null;
        
        return EventResponse.builder()
                .id(event.getId())
                .alertName(event.getAlertName())
                .status(event.getStatus())
                .severity(event.getSeverity())
                .description(event.getDescription())
                .source(event.getSource())
                .instance(event.getInstance())
                .timestamp(event.getTimestamp())
                .linkedIncidentId(event.getLinkedIncidentId())
                .companyId(event.getCompany() != null ? event.getCompany().getCompanyId() : null)
                .build();
    }
}
