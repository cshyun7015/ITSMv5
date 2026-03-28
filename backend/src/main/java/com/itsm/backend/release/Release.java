package com.itsm.backend.release;

import com.itsm.backend.admin.company.Company;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_release")
@Data
public class Release {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "company_code")
    private String companyId;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String status;      // REL_PLANNING, REL_BUILD, REL_TESTING, REL_ROLLOUT, REL_COMPLETED, REL_FAILED
    private String releaseType; // Major, Minor, Patch, Emergency
    
    private String version;
    private String buildNumber;
    
    @Column(columnDefinition = "TEXT")
    private String packageUrl;
    
    private String deploymentMethod; // Blue/Green, Canary, etc.
    
    @Column(columnDefinition = "TEXT")
    private String backoutPlan;
    
    @Column(columnDefinition = "TEXT")
    private String testEvidenceUrl;
    
    @Column(columnDefinition = "TEXT")
    private String releaseNotes;

    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime targetDate;
    
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
