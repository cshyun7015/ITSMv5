package com.itsm.backend.ci;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CIRepository extends JpaRepository<CI, Long> {
    List<CI> findByCompanyIdOrderByName(String companyId);
    List<CI> findAllByOrderByName();
}
