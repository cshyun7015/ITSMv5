package com.itsm.backend.service;

import com.itsm.backend.company.Company;
import com.itsm.backend.company.CompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItServiceService {

    private final ItServiceRepository itServiceRepository;
    private final ServiceDependencyRepository dependencyRepository;
    private final CompanyRepository companyRepository;

    public ItServiceService(ItServiceRepository itServiceRepository,
                            ServiceDependencyRepository dependencyRepository,
                            CompanyRepository companyRepository) {
        this.itServiceRepository = itServiceRepository;
        this.dependencyRepository = dependencyRepository;
        this.companyRepository = companyRepository;
    }

    public List<ItService> getServicesByCompany(String companyId) {
        return itServiceRepository.findByCompanyId(companyId);
    }

    @Transactional
    public ItService createService(ItService itService, String companyId) {
        Company company = companyRepository.findById(companyId).orElseThrow();
        itService.setCompany(company);
        itService.setCompanyId(companyId);
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
