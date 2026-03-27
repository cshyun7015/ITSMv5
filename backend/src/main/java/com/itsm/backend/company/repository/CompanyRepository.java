package com.itsm.backend.company.repository;

import com.itsm.backend.company.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, String> {
    Page<Company> findByCompanyNameContainingIgnoreCaseOrCompanyIdContainingIgnoreCase(String name, String id, Pageable pageable);
}
