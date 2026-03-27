package com.itsm.backend.sla;

import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.company.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SLAService {

    private final SLARepository slaRepository;
    private final CompanyRepository companyRepository;
    private final SLAMapper slaMapper;

    public List<SLAResponse> getAllSLAs() {
        return slaRepository.findAllByOrderByPeriodDesc().stream()
                .map(slaMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<SLAResponse> getSLAsByCompany(String companyId) {
        return slaRepository.findByCompanyIdOrderByPeriodDesc(companyId).stream()
                .map(slaMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SLAResponse createSLARecord(SLA sla, String companyId) {
        Company company = companyRepository.findById(companyId).orElseThrow();
        sla.setCompany(company);
        sla.setCompanyId(companyId);
        
        // Auto-status
        if (sla.getActualValue() != null && sla.getTargetValue() != null) {
            if (sla.getActualValue() >= sla.getTargetValue()) {
                sla.setStatus("SLA_MET");
            } else if (sla.getActualValue() >= sla.getTargetValue() * 0.95) {
                sla.setStatus("SLA_WARNING");
            } else {
                sla.setStatus("SLA_NOT_MET");
            }
        }
        
        SLA saved = slaRepository.save(sla);
        return slaMapper.toResponse(saved);
    }
}
