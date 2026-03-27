package com.itsm.backend.asset.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.itsm.backend.company.Company;
import com.itsm.backend.admin.company.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_asset")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Asset {

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
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

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
