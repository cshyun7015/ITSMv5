package com.itsm.backend.event;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public List<Event> getEvents() {
        return eventService.getAllEvents();
    }

    @PostMapping("/webhook")
    public void handleWebhook(@RequestBody Map<String, Object> payload) {
        eventService.processWebhook(payload);
    }
}
