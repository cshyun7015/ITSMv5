package com.itsm.backend.servicerequest;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RequestValueRepository extends JpaRepository<RequestValue, Long> {
    List<RequestValue> findByRequest(ServiceRequest request);
}
