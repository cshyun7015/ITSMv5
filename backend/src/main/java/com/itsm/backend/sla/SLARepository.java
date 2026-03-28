package com.itsm.backend.sla;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SlaRepository extends JpaRepository<Sla, Long> {
    List<Sla> findByCompanyId(String companyId);
}
