package com.itsm.backend.knowledge;

import com.itsm.backend.auth.SecurityUtils;
import com.itsm.backend.tenant.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/knowledge")
@CrossOrigin(origins = "*")
public class KnowledgeController {

    private final KnowledgeArticleRepository articleRepository;
    private final UserRepository userRepository;

    public KnowledgeController(KnowledgeArticleRepository articleRepository, UserRepository userRepository) {
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<KnowledgeArticle> getArticles(@RequestParam(required = false) String keyword) {
        String tenantId = SecurityUtils.getCurrentTenantId();
        if (keyword != null && !keyword.isBlank()) {
            return articleRepository.findByTenant_TenantIdAndTitleContainingIgnoreCase(tenantId, keyword);
        }
        return articleRepository.findByTenant_TenantIdOrderByCreatedAtDesc(tenantId);
    }

    @PostMapping
    public KnowledgeArticle createArticle(@RequestBody Map<String, Object> payload) {
        String userId = SecurityUtils.getCurrentUserId();
        var author = userRepository.findById(userId).orElseThrow();

        KnowledgeArticle article = new KnowledgeArticle();
        article.setTenant(author.getTenant());
        article.setAuthor(author);
        article.setTitle(payload.get("title").toString());
        article.setContent(payload.get("content").toString());
        article.setCategory(payload.getOrDefault("category", "General").toString());
        article.setViewCount(0);
        article.setCreatedAt(LocalDateTime.now());
        article.setUpdatedAt(LocalDateTime.now());

        return articleRepository.save(article);
    }
}
