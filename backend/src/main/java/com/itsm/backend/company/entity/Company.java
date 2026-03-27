package com.itsm.backend.company.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_company")
@Getter @Setter
public class Company {
    @Id
    private String companyId;
    
    private String companyName;
    private String tier;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
