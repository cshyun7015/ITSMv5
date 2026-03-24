package com.itsm.backend.catalog;

import com.itsm.backend.tenant.Tenant;
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

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    private String catalogName;
    private String description;
    private String category;
    
    // JSON configuration string that defines dynamic form fields (e.g. text inputs, dropdowns)
    @Column(columnDefinition = "TEXT")
    private String formSchema;
    
    private Boolean isPublished;
}
