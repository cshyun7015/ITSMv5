package com.itsm.backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HelloController {

    @GetMapping("/test")
    public Map<String, String> testConnection() {
        return Map.of(
            "message", "Hello from ITSM Spring Boot Backend!",
            "status", "success",
            "dbSupport", "PostgreSQL & MariaDB Ready",
            "architecture", "Containerized Modular Monolith"
        );
    }
}
