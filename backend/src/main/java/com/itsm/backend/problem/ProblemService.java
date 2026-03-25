package com.itsm.backend.problem;

import com.itsm.backend.incident.Incident;
import com.itsm.backend.incident.IncidentRepository;
import com.itsm.backend.tenant.Tenant;
import com.itsm.backend.tenant.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final IncidentRepository incidentRepository;
    private final TenantRepository tenantRepository;

    public List<Problem> getProblemsByTenant(String tenantId) {
        return problemRepository.findByTenantTenantIdOrderByCreatedAtDesc(tenantId);
    }

    @Transactional
    public Problem createProblem(Problem problem, String tenantId) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        problem.setTenant(tenant);
        if (problem.getStatus() == null) problem.setStatus("OPEN");
        return problemRepository.save(problem);
    }

    @Transactional
    public Problem updateProblem(Long id, Problem problemDetails) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        
        problem.setTitle(problemDetails.getTitle());
        problem.setDescription(problemDetails.getDescription());
        problem.setRootCause(problemDetails.getRootCause());
        problem.setWorkaround(problemDetails.getWorkaround());
        problem.setStatus(problemDetails.getStatus());
        problem.setPriority(problemDetails.getPriority());
        
        return problemRepository.save(problem);
    }

    @Transactional
    public void linkIncidentToProblem(Long problemId, Long incidentId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));
        
        incident.setProblem(problem);
        incidentRepository.save(incident);
    }
}
