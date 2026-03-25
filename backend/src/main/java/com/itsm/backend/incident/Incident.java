package com.itsm.backend.incident;

import com.itsm.backend.tenant.Tenant;
import com.itsm.backend.tenant.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_incident")
@Getter @Setter
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id")
    private User reporter;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    // Denormalized for JSON output — separate columns, not FK columns
    @Column(name = "tenant_code")
    private String tenantId;

    @Column(name = "reporter_code")
    private String reporterId;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String status;    // INC_OPEN, INC_IN_PROGRESS, INC_RESOLVED, INC_CLOSED
    private String priority;  // Critical, High, Medium, Low
    private String impact;    // Service-wide, Department, Individual

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id")
    private com.itsm.backend.problem.Problem problem;

    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
