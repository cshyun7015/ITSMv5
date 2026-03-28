package com.itsm.backend.incident;

import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.user.User;
import com.itsm.backend.problem.Problem;
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
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id")
    private User reporter;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @Column(name = "company_code")
    private String companyId;

    @Column(name = "reporter_code")
    private String reporterId;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String status;    // INC_OPEN, INC_IN_PROGRESS, INC_ON_HOLD, INC_RESOLVED, INC_CLOSED, INC_CANCELED
    private String priority;  // Critical, High, Medium, Low
    private String impact;    // Service-wide, Department, Individual
    private String urgency;   // High, Medium, Low
    
    private String category;
    private String subcategory;
    private String source;     // Portal, Email, Call, Monitoring, Manual

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id")
    private Problem problem;

    @Column(name = "asset_id")
    private Long assetId;

    private String assignedGroup;
    
    private String resolutionCode;
    @Column(columnDefinition = "TEXT")
    private String resolutionDescription;

    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
}
