package com.itsm.backend.event;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByTenant_TenantIdOrderByTimestampDesc(String tenantId);
    List<Event> findAllByOrderByTimestampDesc();
}
