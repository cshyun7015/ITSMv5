package com.itsm.backend.admin.company.service;

import com.itsm.backend.admin.company.dto.CompanyRequest;
import com.itsm.backend.admin.company.dto.CompanyResponse;
import com.itsm.backend.admin.company.entity.Company;
import com.itsm.backend.admin.company.mapper.CompanyMapper;
import com.itsm.backend.admin.company.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;

    public Page<CompanyResponse> getCompanies(String search, Pageable pageable) {
        Page<Company> companies;
        if (search == null || search.isEmpty()) {
            companies = companyRepository.findAll(pageable);
        } else {
            companies = companyRepository.findByCompanyNameContainingIgnoreCaseOrCompanyIdContainingIgnoreCase(search, search, pageable);
        }
        return companies.map(companyMapper::toResponse);
    }

    @Transactional
    public CompanyResponse createCompany(CompanyRequest request) {
        Company company = new Company();
        company.setCompanyId(request.getCompanyId());
        company.setCompanyName(request.getCompanyName());
        company.setTier(request.getTier() != null ? request.getTier() : "Standard");
        company.setIsActive(true);
        company.setCreatedAt(LocalDateTime.now());
        
        Company saved = companyRepository.save(company);
        return companyMapper.toResponse(saved);
    }

    @Transactional
    public CompanyResponse updateCompany(String companyId, CompanyRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        
        if (request.getCompanyName() != null) company.setCompanyName(request.getCompanyName());
        if (request.getTier() != null) company.setTier(request.getTier());
        if (request.getIsActive() != null) company.setIsActive(request.getIsActive());
        
        return companyMapper.toResponse(company);
    }

    @Transactional
    public void deleteCompany(String companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        companyRepository.delete(company);
    }
}
