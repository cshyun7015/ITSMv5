package com.itsm.backend.change;

import com.itsm.backend.tenant.Tenant;
import com.itsm.backend.tenant.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_change_request")
@Getter @Setter
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
    private User requester;

    private String tenantId;
    private String requesterId;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String rollbackPlan;

    private String changeType;  // Standard, Normal, Emergency
    private String status;      // CHG_DRAFT, CHG_REVIEW, CHG_APPROVED, CHG_IN_PROGRESS, CHG_COMPLETED, CHG_FAILED
    private String risk;        // Low, Medium, High

    private LocalDateTime plannedStart;
    private LocalDateTime plannedEnd;
    private LocalDateTime createdAt;
}
