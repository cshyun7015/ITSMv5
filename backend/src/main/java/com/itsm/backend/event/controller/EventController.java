package com.itsm.backend.event.controller;

import com.itsm.backend.auth.SecurityUtils;
import com.itsm.backend.event.dto.EventResponse;
import com.itsm.backend.event.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    @GetMapping
    public List<EventResponse> getEvents() {
        String role = SecurityUtils.getCurrentRole();
        String companyId = SecurityUtils.getCurrentCompanyId();

        if ("ROLE_ADMIN".equals(role)) {
            return eventService.getAllEvents();
        } else {
            return eventService.getEventsByCompany(companyId);
        }
    }

    @PostMapping("/webhook")
    public void handleWebhook(@RequestBody Map<String, Object> payload) {
        eventService.processWebhook(payload);
    }
}
