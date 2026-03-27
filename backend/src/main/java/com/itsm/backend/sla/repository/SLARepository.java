package com.itsm.backend.sla.repository;

import com.itsm.backend.sla.entity.SLA;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SLARepository extends JpaRepository<SLA, Long> {
    List<SLA> findByCompanyIdOrderByPeriodDesc(String companyId);
    List<SLA> findAllByOrderByPeriodDesc();
}
