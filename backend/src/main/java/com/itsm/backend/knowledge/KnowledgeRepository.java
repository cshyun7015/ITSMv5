package com.itsm.backend.knowledge;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KnowledgeRepository extends JpaRepository<Knowledge, Long> {
    List<Knowledge> findByCompany_CompanyIdOrderByCreatedAtDesc(String companyId);
    List<Knowledge> findByCompany_CompanyIdAndTitleContainingIgnoreCase(String companyId, String keyword);
}
