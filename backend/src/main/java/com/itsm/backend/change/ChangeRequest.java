package com.itsm.backend.change;

import com.itsm.backend.tenant.Tenant;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@jakarta.persistence.Entity
@jakarta.persistence.Table(name = "tb_change_request")
@lombok.Data
public class ChangeRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id")
    private com.itsm.backend.tenant.User requester;

    @Column(name = "tenant_code")
    private String tenantId;

    @Column(name = "requester_code")
    private String requesterId;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String changeReason;

    @Column(columnDefinition = "TEXT")
    private String riskAssessment;

    @Column(columnDefinition = "TEXT")
    private String impactAnalysis;

    @Column(columnDefinition = "TEXT")
    private String implementationPlan;

    @Column(columnDefinition = "TEXT")
    private String rollbackPlan;

    private String changeType;  // Standard, Normal, Emergency
    private String status;      // CHG_DRAFT, CHG_SUBMITTED, CHG_REVIEW, CHG_APPROVED, CHG_SCHEDULED, CHG_IMPLEMENTING, CHG_CLOSED
    private String risk;        // Low, Medium, High
    private String priority;    // Low, Medium, High, Critical

    private LocalDateTime plannedStart;
    private LocalDateTime plannedEnd;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
