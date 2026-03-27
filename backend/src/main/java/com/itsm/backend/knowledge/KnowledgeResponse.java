package com.itsm.backend.knowledge;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class KnowledgeResponse {
    private Long id;
    private String title;
    private String content;
    private String category;
    private int viewCount;
    private String authorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
