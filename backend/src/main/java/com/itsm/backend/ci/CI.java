package com.itsm.backend.ci.entity;

import com.itsm.backend.company.Company;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_ci")
@Data
public class ConfigurationItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "company_code")
    private String companyId;

    private String name;
    private String type;      // Server, DB, Application, Cluster
    private String status;    // CI_ACTIVE, CI_DEPRECIATED, CI_OFFLINE
    private String model;
    private String location;
    
    @Column(columnDefinition = "TEXT")
    private String specifications;

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
