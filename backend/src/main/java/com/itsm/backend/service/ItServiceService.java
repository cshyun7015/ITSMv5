package com.itsm.backend.service;

import com.itsm.backend.tenant.Tenant;
import com.itsm.backend.tenant.TenantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItServiceService {

    private final ItServiceRepository itServiceRepository;
    private final ServiceDependencyRepository dependencyRepository;
    private final TenantRepository tenantRepository;

    public ItServiceService(ItServiceRepository itServiceRepository,
                            ServiceDependencyRepository dependencyRepository,
                            TenantRepository tenantRepository) {
        this.itServiceRepository = itServiceRepository;
        this.dependencyRepository = dependencyRepository;
        this.tenantRepository = tenantRepository;
    }

    public List<ItService> getServicesByTenant(String tenantId) {
        return itServiceRepository.findByTenantId(tenantId);
    }

    @Transactional
    public ItService createService(ItService itService, String tenantId) {
        Tenant tenant = tenantRepository.findById(tenantId).orElseThrow();
        itService.setTenant(tenant);
        itService.setTenantId(tenantId);
        return itServiceRepository.save(itService);
    }

    @Transactional
    public void updateDependencies(Long serviceId, List<Long> assetIds) {
        dependencyRepository.deleteByServiceId(serviceId);
        for (Long assetId : assetIds) {
            ServiceDependency dep = new ServiceDependency();
            dep.setServiceId(serviceId);
            dep.setAssetId(assetId);
            dep.setDependencyType("REQUIRED");
            dependencyRepository.save(dep);
        }
    }

    public List<ServiceDependency> getDependencies(Long serviceId) {
        return dependencyRepository.findByServiceId(serviceId);
    }

    /**
     * Business Impact Analysis (BIA)
     * Find all services impacted by the failure of a specific asset (CI).
     */
    public List<ItService> getImpactedServices(Long assetId) {
        List<ServiceDependency> deps = dependencyRepository.findByAssetId(assetId);
        List<Long> serviceIds = deps.stream()
                .map(ServiceDependency::getServiceId)
                .distinct()
                .collect(Collectors.toList());
        return itServiceRepository.findAllById(serviceIds);
    }
}
