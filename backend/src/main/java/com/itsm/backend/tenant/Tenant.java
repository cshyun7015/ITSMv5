package com.itsm.backend.tenant;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_tenant")
@Getter @Setter
public class Tenant {
    @Id
    private String tenantId;
    
    private String tenantName;
    private String tier;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
