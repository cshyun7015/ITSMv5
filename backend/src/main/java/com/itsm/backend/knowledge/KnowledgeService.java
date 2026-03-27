package com.itsm.backend.knowledge.service;

import com.itsm.backend.auth.SecurityUtils;
import com.itsm.backend.knowledge.dto.KnowledgeRequest;
import com.itsm.backend.knowledge.dto.KnowledgeResponse;
import com.itsm.backend.knowledge.entity.KnowledgeArticle;
import com.itsm.backend.knowledge.mapper.KnowledgeMapper;
import com.itsm.backend.knowledge.repository.KnowledgeRepository;
import com.itsm.backend.company.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class KnowledgeService {

    private final KnowledgeRepository articleRepository;
    private final UserRepository userRepository;
    private final KnowledgeMapper knowledgeMapper;

    public List<KnowledgeResponse> getArticles(String keyword) {
        String companyId = SecurityUtils.getCurrentCompanyId();
        
        List<KnowledgeArticle> articles;
        if (keyword != null && !keyword.isBlank()) {
            articles = articleRepository.findByCompany_CompanyIdAndTitleContainingIgnoreCase(companyId, keyword);
        } else {
            articles = articleRepository.findByCompany_CompanyIdOrderByCreatedAtDesc(companyId);
        }
        
        return articles.stream()
                .map(knowledgeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public KnowledgeResponse createArticle(KnowledgeRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        var author = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        KnowledgeArticle article = new KnowledgeArticle();
        article.setCompany(author.getCompany());
        article.setAuthor(author);
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        article.setCategory(request.getCategory() != null ? request.getCategory() : "General");
        article.setViewCount(0);
        article.setCreatedAt(LocalDateTime.now());
        article.setUpdatedAt(LocalDateTime.now());

        KnowledgeArticle saved = articleRepository.save(article);
        return knowledgeMapper.toResponse(saved);
    }
}
