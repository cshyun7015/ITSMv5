package com.itsm.backend.problem;

import com.itsm.backend.incident.Incident;
import com.itsm.backend.admin.company.Company;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_problem")
@Getter
@Setter
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String rootCause;

    @Column(columnDefinition = "TEXT")
    private String workaround;

    private String status; // PRB_NEW, PRB_RCA, PRB_KNOWN_ERROR, PRB_RESOLVED, PRB_CLOSED
    private String priority; // Critical, High, Medium, Low
    private String urgency;
    private String impact;
    
    private String category;
    
    @Column(columnDefinition = "TEXT")
    private String resolution;

    private String assignedGroup;

    @CreationTimestamp
    private LocalDateTime createdAt;
    
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @OneToMany(mappedBy = "problem")
    private List<Incident> incidents = new ArrayList<>();
}
