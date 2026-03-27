package com.itsm.backend.problem.controller;

import com.itsm.backend.auth.SecurityUtils;
import com.itsm.backend.problem.dto.ProblemResponse;
import com.itsm.backend.problem.entity.Problem;
import com.itsm.backend.problem.service.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProblemController {

    private final ProblemService problemService;

    @GetMapping
    public List<ProblemResponse> getProblems() {
        String role = SecurityUtils.getCurrentRole();
        String companyId = SecurityUtils.getCurrentCompanyId();

        if ("ROLE_ADMIN".equals(role)) {
            return problemService.getAllProblems();
        } else {
            return problemService.getProblemsByCompany(companyId);
        }
    }

    @PostMapping
    public ProblemResponse createProblem(@RequestBody Problem problem) {
        String companyId = SecurityUtils.getCurrentCompanyId();
        return problemService.createProblem(problem, companyId);
    }

    @PutMapping("/{id}")
    public ProblemResponse updateProblem(@PathVariable Long id, @RequestBody Problem problem) {
        return problemService.updateProblem(id, problem);
    }

    @PostMapping("/{problemId}/link/{incidentId}")
    public ResponseEntity<Void> linkIncident(@PathVariable Long problemId, @PathVariable Long incidentId) {
        problemService.linkIncidentToProblem(problemId, incidentId);
        return ResponseEntity.ok().build();
    }
}
