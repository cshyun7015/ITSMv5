package com.itsm.backend.sla;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SlaMetricRepository extends JpaRepository<SlaMetric, Long> {
    List<SlaMetric> findBySlaId(Long slaId);
}
