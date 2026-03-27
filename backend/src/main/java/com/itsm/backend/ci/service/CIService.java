package com.itsm.backend.ci.service;

import com.itsm.backend.ci.dto.CIResponse;
import com.itsm.backend.ci.entity.ConfigurationItem;
import com.itsm.backend.ci.mapper.CIMapper;
import com.itsm.backend.ci.repository.CIRepository;
import com.itsm.backend.company.Company;
import com.itsm.backend.company.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CIService {

    private final CIRepository ciRepository;
    private final CompanyRepository companyRepository;
    private final CIMapper ciMapper;

    public List<CIResponse> getAllCIs() {
        return ciRepository.findAllByOrderByName().stream()
                .map(ciMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<CIResponse> getCIsByCompany(String companyId) {
        return ciRepository.findByCompanyIdOrderByName(companyId).stream()
                .map(ciMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CIResponse createCI(ConfigurationItem ci, String companyId) {
        Company company = companyRepository.findById(companyId).orElseThrow();
        ci.setCompany(company);
        ci.setCompanyId(companyId);
        if (ci.getStatus() == null) ci.setStatus("CI_ACTIVE");
        
        ConfigurationItem saved = ciRepository.save(ci);
        return ciMapper.toResponse(saved);
    }
}
