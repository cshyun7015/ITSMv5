package com.itsm.backend.sla;

import com.itsm.backend.admin.company.Company;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_sla_record")
@Data
public class SLA {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "company_code")
    private String companyId;

    private String serviceName;
    private Double targetValue;
    private Double actualValue;
    private String unit;        // e.g. %, ms
    private String period;      // e.g. 2024-03
    private String status;      // SLA_MET, SLA_NOT_MET, SLA_WARNING
    
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
