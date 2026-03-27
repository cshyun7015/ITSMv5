package com.itsm.backend.servicedependency;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceDependencyRepository extends JpaRepository<ServiceDependency, Long> {
    List<ServiceDependency> findByServiceId(Long serviceId);
    List<ServiceDependency> findByAssetId(Long assetId);
    void deleteByServiceId(Long serviceId);
}
