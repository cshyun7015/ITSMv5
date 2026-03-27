package com.itsm.backend.admin.user;

import com.itsm.backend.admin.company.Company;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tb_user")
@Getter @Setter
public class User {
    @Id
    private String userId;
    
    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
    
    private String password;
    private String userName;
    private String role;
    private String email;
}
