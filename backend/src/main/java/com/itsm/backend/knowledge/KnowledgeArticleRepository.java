package com.itsm.backend.knowledge;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KnowledgeArticleRepository extends JpaRepository<KnowledgeArticle, Long> {
    List<KnowledgeArticle> findByTenant_TenantIdOrderByCreatedAtDesc(String tenantId);
    List<KnowledgeArticle> findByTenant_TenantIdAndTitleContainingIgnoreCase(String tenantId, String keyword);
}
