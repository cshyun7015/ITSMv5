package com.itsm.backend.problem;

import com.itsm.backend.incident.Incident;
import com.itsm.backend.incident.IncidentRepository;
import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.company.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
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
                .orElse(null);
    }

    @Transactional
    public ProblemResponse createProblem(Problem problem, String companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        problem.setCompany(company);
        if (problem.getStatus() == null) problem.setStatus("OPEN");
        return problemMapper.toResponse(problemRepository.save(problem));
    }

    @Transactional
    public ProblemResponse updateProblem(Long id, Problem problemDetails) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        
        problem.setTitle(problemDetails.getTitle());
        problem.setDescription(problemDetails.getDescription());
        problem.setRootCause(problemDetails.getRootCause());
        problem.setWorkaround(problemDetails.getWorkaround());
        problem.setStatus(problemDetails.getStatus());
        problem.setPriority(problemDetails.getPriority());
        
        return problemMapper.toResponse(problemRepository.save(problem));
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
