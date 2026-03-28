package com.itsm.backend.servicecatalog;

import com.itsm.backend.admin.company.Company;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tb_service_catalog")
@Getter @Setter
public class ServiceCatalog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    private String catalogName;
    private String description;
    private String category;
    private String icon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private com.itsm.backend.admin.user.User serviceOwner;

    private String fulfillmentGroup;
    private Integer slaHours;
    private java.math.BigDecimal estimatedCost;
    private String defaultUrgency; // LOW, MEDIUM, HIGH

    private Boolean isPublished;
}
