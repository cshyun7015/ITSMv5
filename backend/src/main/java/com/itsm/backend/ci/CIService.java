package com.itsm.backend.ci;

import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.company.CompanyRepository;
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
    public CIResponse createCI(CI ci, String companyId) {
        Company company = companyRepository.findById(companyId).orElseThrow();
        ci.setCompany(company);
        ci.setCompanyId(companyId);
        if (ci.getStatus() == null) ci.setStatus("CI_ACTIVE");
        
        CI saved = ciRepository.save(ci);
        return ciMapper.toResponse(saved);
    }
}
