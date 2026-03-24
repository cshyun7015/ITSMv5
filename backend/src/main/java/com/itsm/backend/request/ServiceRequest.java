package com.itsm.backend.request;

import com.itsm.backend.catalog.ServiceCatalog;
import com.itsm.backend.tenant.Tenant;
import com.itsm.backend.tenant.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_service_request")
@Getter @Setter
public class ServiceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "catalog_id", nullable = false)
    private ServiceCatalog catalog;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id")
    private User requester;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    // JSON representation of user-submitted form data corresponding to the catalog's formSchema
    @Column(columnDefinition = "TEXT")
    private String formData; 

    private String status;
    private String priority;
    
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
