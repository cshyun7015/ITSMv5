package com.itsm.backend.knowledge;

import org.springframework.stereotype.Component;

@Component
public class KnowledgeMapper {
    public KnowledgeResponse toResponse(Knowledge article) {
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
