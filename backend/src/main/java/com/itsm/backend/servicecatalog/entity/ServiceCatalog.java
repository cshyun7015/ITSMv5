package com.itsm.backend.servicecatalog.entity;

import com.itsm.backend.company.Company;
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
    
    @Column(columnDefinition = "TEXT")
    private String formSchema;
    
    private Boolean isPublished;
}
