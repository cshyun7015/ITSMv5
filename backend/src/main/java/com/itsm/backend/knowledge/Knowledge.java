package com.itsm.backend.knowledge;

import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_knowledge_article")
@Getter @Setter
public class Knowledge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;

    private String category;
    private int viewCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
