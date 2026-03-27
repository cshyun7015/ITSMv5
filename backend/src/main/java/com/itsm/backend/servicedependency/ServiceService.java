package com.itsm.backend.servicedependency;

import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.company.CompanyRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final ServiceDependencyRepository dependencyRepository;
    private final CompanyRepository companyRepository;

    public ServiceService(ServiceRepository serviceRepository,
                          ServiceDependencyRepository dependencyRepository,
                          CompanyRepository companyRepository) {
        this.serviceRepository = serviceRepository;
        this.dependencyRepository = dependencyRepository;
        this.companyRepository = companyRepository;
    }

    public List<Service> getServicesByCompany(String companyId) {
        return serviceRepository.findByCompanyId(companyId);
    }

    @Transactional
    public Service createService(Service service, String companyId) {
        Company company = companyRepository.findById(companyId).orElseThrow();
        service.setCompany(company);
        service.setCompanyId(companyId);
        return serviceRepository.save(service);
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
    public List<Service> getImpactedServices(Long assetId) {
        List<ServiceDependency> deps = dependencyRepository.findByAssetId(assetId);
        List<Long> serviceIds = deps.stream()
                .map(ServiceDependency::getServiceId)
                .distinct()
                .collect(Collectors.toList());
        return serviceRepository.findAllById(serviceIds);
    }
}
