package com.itsm.backend.service;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tb_service_dependency")
@Data
public class ServiceDependency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "service_id", nullable = false)
    private Long serviceId;

    @Column(name = "asset_id", nullable = false)
    private Long assetId;

    private String dependencyType; // REQUIRED, OPTIONAL
}
