package com.itsm.backend.release;

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
public class ReleaseService {

    private final ReleaseRepository releaseRepository;
    private final CompanyRepository companyRepository;
    private final ReleaseMapper releaseMapper;

    public List<ReleaseResponse> getAllReleases() {
        return releaseRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(releaseMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ReleaseResponse> getReleasesByCompany(String companyId) {
        return releaseRepository.findByCompanyIdOrderByCreatedAtDesc(companyId).stream()
                .map(releaseMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ReleaseResponse getRelease(Long id) {
        return releaseRepository.findById(id)
                .map(releaseMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Release not found: " + id));
    }

    @Transactional
    public ReleaseResponse createRelease(Release rel, String companyId) {
        Company company = companyRepository.findById(companyId).orElseThrow();
        rel.setCompany(company);
        rel.setCompanyId(companyId);
        if (rel.getStatus() == null) rel.setStatus("REL_PLANNING");
        
        Release saved = releaseRepository.save(rel);
        return releaseMapper.toResponse(saved);
    }

    @Transactional
    public ReleaseResponse updateRelease(Long id, Release updates) {
        Release rel = releaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Release not found"));
        
        if (updates.getTitle() != null) rel.setTitle(updates.getTitle());
        if (updates.getDescription() != null) rel.setDescription(updates.getDescription());
        if (updates.getStatus() != null) rel.setStatus(updates.getStatus());
        if (updates.getReleaseType() != null) rel.setReleaseType(updates.getReleaseType());
        
        if (updates.getVersion() != null) rel.setVersion(updates.getVersion());
        if (updates.getBuildNumber() != null) rel.setBuildNumber(updates.getBuildNumber());
        if (updates.getPackageUrl() != null) rel.setPackageUrl(updates.getPackageUrl());
        if (updates.getDeploymentMethod() != null) rel.setDeploymentMethod(updates.getDeploymentMethod());
        if (updates.getBackoutPlan() != null) rel.setBackoutPlan(updates.getBackoutPlan());
        if (updates.getTestEvidenceUrl() != null) rel.setTestEvidenceUrl(updates.getTestEvidenceUrl());
        if (updates.getReleaseNotes() != null) rel.setReleaseNotes(updates.getReleaseNotes());
        
        if (updates.getTargetDate() != null) rel.setTargetDate(updates.getTargetDate());
        
        rel.setUpdatedAt(LocalDateTime.now());
        return releaseMapper.toResponse(releaseRepository.save(rel));
    }

    @Transactional
    public ReleaseResponse updateStatus(Long id, String status, String companyId, String role) {
        Release rel = releaseRepository.findById(id).orElseThrow();
        if (!"ROLE_ADMIN".equals(role) && !rel.getCompanyId().equals(companyId)) {
            throw new RuntimeException("Access denied");
        }
        rel.setStatus(status);
        rel.setUpdatedAt(LocalDateTime.now());
        return releaseMapper.toResponse(releaseRepository.save(rel));
    }

    @Transactional
    public void deleteRelease(Long id) {
        releaseRepository.deleteById(id);
    }
}
