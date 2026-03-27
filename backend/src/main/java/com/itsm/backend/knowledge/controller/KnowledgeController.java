package com.itsm.backend.knowledge.controller;

import com.itsm.backend.knowledge.dto.KnowledgeRequest;
import com.itsm.backend.knowledge.dto.KnowledgeResponse;
import com.itsm.backend.knowledge.service.KnowledgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/knowledge")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class KnowledgeController {

    private final KnowledgeService knowledgeService;

    @GetMapping
    public List<KnowledgeResponse> getArticles(@RequestParam(required = false) String keyword) {
        return knowledgeService.getArticles(keyword);
    }

    @PostMapping
    public KnowledgeResponse createArticle(@RequestBody KnowledgeRequest request) {
        return knowledgeService.createArticle(request);
    }
}
