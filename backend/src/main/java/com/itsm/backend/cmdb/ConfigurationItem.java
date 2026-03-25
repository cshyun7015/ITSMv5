package com.itsm.backend.cmdb;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.itsm.backend.tenant.Tenant;
import com.itsm.backend.tenant.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_configuration_item")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ConfigurationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // e.g., SERVER, LAPTOP, SOFTWARE, NETWORK_DEVICE

    private String status; // e.g., IN_USE, IN_STOCK, RETIRED, BROKEN

    private String serialNumber;

    private String model;

    private String manufacturer;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String specifications; // JSON or free text for tech specs

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
