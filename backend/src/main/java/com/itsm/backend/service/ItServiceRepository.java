package com.itsm.backend.service;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItServiceRepository extends JpaRepository<ItService, Long> {
    List<ItService> findByCompanyId(String companyId);
}
