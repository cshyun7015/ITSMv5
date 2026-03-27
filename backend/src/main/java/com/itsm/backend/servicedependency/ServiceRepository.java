package com.itsm.backend.servicedependency;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByCompanyId(String companyId);
}
