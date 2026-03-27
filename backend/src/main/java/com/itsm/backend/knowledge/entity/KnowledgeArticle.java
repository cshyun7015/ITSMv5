package com.itsm.backend.knowledge.entity;

import com.itsm.backend.company.Company;
import com.itsm.backend.company.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_knowledge_article")
@Getter @Setter
public class KnowledgeArticle {
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
