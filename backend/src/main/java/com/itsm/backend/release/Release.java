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

    private String status;      // REL_PLANNED, REL_DEVELOPING, REL_TESTING, REL_DEPROYING, REL_COMPLETED, REL_ROLLED_BACK
    private String releaseType; // Major, Minor, Patch, Emergency
    
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
