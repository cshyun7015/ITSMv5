package com.itsm.backend.problem;

import com.itsm.backend.incident.Incident;
import com.itsm.backend.incident.IncidentRepository;
import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.company.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final IncidentRepository incidentRepository;
    private final CompanyRepository companyRepository;
    private final ProblemMapper problemMapper;

    public List<ProblemResponse> getAllProblems() {
        return problemRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(problemMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProblemResponse> getProblemsByCompany(String companyId) {
        return problemRepository.findByCompanyCompanyIdOrderByCreatedAtDesc(companyId).stream()
                .map(problemMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ProblemResponse getProblem(Long id) {
        return problemRepository.findById(id)
                .map(problemMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Problem not found: " + id));
    }

    @Transactional
    public ProblemResponse createProblem(Problem problem, String companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        
        problem.setCompany(company);
        if (problem.getStatus() == null) problem.setStatus("PRB_NEW");
        if (problem.getUrgency() == null) problem.setUrgency("Medium");
        if (problem.getImpact() == null) problem.setImpact("Medium");
        
        problem.setPriority(calculatePriority(problem.getUrgency(), problem.getImpact()));
        problem.setCreatedAt(LocalDateTime.now());
        
        return problemMapper.toResponse(problemRepository.save(problem));
    }

    @Transactional
    public ProblemResponse updateProblem(Long id, Problem updates) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        
        if (updates.getTitle() != null) problem.setTitle(updates.getTitle());
        if (updates.getDescription() != null) problem.setDescription(updates.getDescription());
        if (updates.getRootCause() != null) problem.setRootCause(updates.getRootCause());
        if (updates.getWorkaround() != null) problem.setWorkaround(updates.getWorkaround());
        if (updates.getResolution() != null) problem.setResolution(updates.getResolution());
        if (updates.getCategory() != null) problem.setCategory(updates.getCategory());
        if (updates.getAssignedGroup() != null) problem.setAssignedGroup(updates.getAssignedGroup());
        
        if (updates.getStatus() != null) {
            String newStatus = updates.getStatus();
            problem.setStatus(newStatus);
            if ("PRB_RESOLVED".equals(newStatus)) {
                problem.setResolvedAt(LocalDateTime.now());
            } else if ("PRB_CLOSED".equals(newStatus)) {
                problem.setClosedAt(LocalDateTime.now());
            }
        }
        
        if (updates.getUrgency() != null) problem.setUrgency(updates.getUrgency());
        if (updates.getImpact() != null) problem.setImpact(updates.getImpact());
        
        problem.setPriority(calculatePriority(problem.getUrgency(), problem.getImpact()));
        
        return problemMapper.toResponse(problemRepository.save(problem));
    }

    @Transactional
    public void deleteProblem(Long id) {
        problemRepository.deleteById(id);
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

    private String calculatePriority(String urgency, String impact) {
        if ("High".equalsIgnoreCase(urgency) && "High".equalsIgnoreCase(impact)) return "Critical";
        if ("High".equalsIgnoreCase(urgency) || "High".equalsIgnoreCase(impact)) return "High";
        if ("Low".equalsIgnoreCase(urgency) && "Low".equalsIgnoreCase(impact)) return "Low";
        return "Medium";
    }
}
