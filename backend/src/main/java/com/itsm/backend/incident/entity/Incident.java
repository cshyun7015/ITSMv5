package com.itsm.backend.incident.entity;

import com.itsm.backend.company.Company;
import com.itsm.backend.company.entity.User;
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

    private String status;    // INC_OPEN, INC_IN_PROGRESS, INC_RESOLVED, INC_CLOSED
    private String priority;  // Critical, High, Medium, Low
    private String impact;    // Service-wide, Department, Individual

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id")
    private com.itsm.backend.problem.entity.Problem problem;

    @Column(name = "asset_id")
    private Long assetId;

    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
