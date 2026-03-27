package com.itsm.backend.knowledge.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KnowledgeRequest {
    private String title;
    private String content;
    private String category;
}
