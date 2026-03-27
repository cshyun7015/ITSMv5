package com.itsm.backend.release.service;

import com.itsm.backend.release.dto.ReleaseResponse;
import com.itsm.backend.release.entity.Release;
import com.itsm.backend.release.mapper.ReleaseMapper;
import com.itsm.backend.release.repository.ReleaseRepository;
import com.itsm.backend.company.Company;
import com.itsm.backend.company.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
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

    @Transactional
    public ReleaseResponse createRelease(Release rel, String companyId) {
        Company company = companyRepository.findById(companyId).orElseThrow();
        rel.setCompany(company);
        rel.setCompanyId(companyId);
        if (rel.getStatus() == null) rel.setStatus("REL_PLANNED");
        
        Release saved = releaseRepository.save(rel);
        return releaseMapper.toResponse(saved);
    }

    @Transactional
    public ReleaseResponse updateStatus(Long id, String status, String companyId, String role) {
        Release rel = releaseRepository.findById(id).orElseThrow();
        if (!"ROLE_ADMIN".equals(role) && !rel.getCompanyId().equals(companyId)) {
            throw new RuntimeException("Access denied");
        }
        rel.setStatus(status);
        return releaseMapper.toResponse(releaseRepository.save(rel));
    }
}
