package com.itsm.backend.knowledge.repository;

import com.itsm.backend.knowledge.entity.KnowledgeArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KnowledgeRepository extends JpaRepository<KnowledgeArticle, Long> {
    List<KnowledgeArticle> findByCompany_CompanyIdOrderByCreatedAtDesc(String companyId);
    List<KnowledgeArticle> findByCompany_CompanyIdAndTitleContainingIgnoreCase(String companyId, String keyword);
}
