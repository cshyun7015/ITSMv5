package com.itsm.backend.servicecatalog;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tb_catalog_field")
@Getter @Setter
public class CatalogField {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "catalog_id", nullable = false)
    private ServiceCatalog catalog;

    private String fieldName;  // e.g. "laptop_model"
    private String fieldLabel; // e.g. "Laptop Model"
    private String fieldType;  // TEXT, NUMBER, DATE, SELECT, CHECKBOX
    private boolean isRequired;
    private int fieldOrder;

    @Column(columnDefinition = "TEXT")
    private String fieldOptions; // JSON string for SELECT options, e.g. ["Dell", "HP", "MacBook"]
}
