package com.itsm.backend.servicerequest;

import com.itsm.backend.servicecatalog.CatalogField;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tb_request_value")
@Getter @Setter
public class RequestValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private ServiceRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id", nullable = false)
    private CatalogField field;

    @Column(columnDefinition = "TEXT")
    private String fieldValue;
}
