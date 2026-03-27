package com.itsm.backend.ci.repository;

import com.itsm.backend.ci.entity.ConfigurationItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CIRepository extends JpaRepository<ConfigurationItem, Long> {
    List<ConfigurationItem> findByCompanyIdOrderByName(String companyId);
    List<ConfigurationItem> findAllByOrderByName();
}
