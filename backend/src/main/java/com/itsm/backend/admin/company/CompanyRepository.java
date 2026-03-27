package com.itsm.backend.admin.company;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, String> {
    Page<Company> findByCompanyNameContainingIgnoreCaseOrCompanyIdContainingIgnoreCase(String name, String id, Pageable pageable);
}
