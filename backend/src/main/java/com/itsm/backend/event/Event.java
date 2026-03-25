package com.itsm.backend.event;

import com.itsm.backend.tenant.Tenant;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_event")
@Data
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String alertName;

    private String status; // firing, resolved

    private String severity; // critical, warning, info

    @Column(columnDefinition = "TEXT")
    private String description;

    private String source; // e.g., Grafana, Prometheus

    private String instance;

    private LocalDateTime timestamp;

    private Long linkedIncidentId; // Optional link to an Incident

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id")
    private Tenant tenant; // Events might be tenant-specific if mapped
}
