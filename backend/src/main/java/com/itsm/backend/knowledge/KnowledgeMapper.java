package com.itsm.backend.knowledge.mapper;

import com.itsm.backend.knowledge.dto.KnowledgeResponse;
import com.itsm.backend.knowledge.entity.KnowledgeArticle;
import org.springframework.stereotype.Component;

@Component
public class KnowledgeMapper {
    public KnowledgeResponse toResponse(KnowledgeArticle article) {
        return KnowledgeResponse.builder()
                .id(article.getId())
                .title(article.getTitle())
                .content(article.getContent())
                .category(article.getCategory())
                .viewCount(article.getViewCount())
                .authorName(article.getAuthor() != null ? article.getAuthor().getUserName() : "Unknown")
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .build();
    }
}
