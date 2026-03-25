package com.itsm.backend.problem;

import com.itsm.backend.auth.TenantAwareAuthentication;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;

    @GetMapping
    public List<Problem> getProblems(Authentication authentication) {
        String tenantId = ((TenantAwareAuthentication) authentication).getTenantId();
        return problemService.getProblemsByTenant(tenantId);
    }

    @PostMapping
    public Problem createProblem(@RequestBody Problem problem, Authentication authentication) {
        String tenantId = ((TenantAwareAuthentication) authentication).getTenantId();
        return problemService.createProblem(problem, tenantId);
    }

    @PutMapping("/{id}")
    public Problem updateProblem(@PathVariable Long id, @RequestBody Problem problem) {
        return problemService.updateProblem(id, problem);
    }

    @PostMapping("/{problemId}/link/{incidentId}")
    public ResponseEntity<Void> linkIncident(@PathVariable Long problemId, @PathVariable Long incidentId) {
        problemService.linkIncidentToProblem(problemId, incidentId);
        return ResponseEntity.ok().build();
    }
}
