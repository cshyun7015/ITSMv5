package com.itsm.backend.sla;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.itsm.backend.admin.company.Company;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_sla")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sla {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Agreement name is required")
    @JsonProperty("name")
    @Column(nullable = false)
    private String name;

    @JsonProperty("description")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Customer name is required")
    @JsonProperty("customerName")
    @Column(name = "customer_name")
    private String customerName;

    @Enumerated(EnumType.STRING)
    private SlaStatus status = SlaStatus.SLA_DRAFT;

    @Column(name = "service_hours")
    private String serviceHours; // e.g., 24x7, 09:00-18:00 Weekdays

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "company_id", nullable = false)
    private String companyId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", insertable = false, updatable = false)
    private Company company;

    @OneToMany(mappedBy = "sla", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SlaMetric> metrics = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
