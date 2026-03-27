package com.itsm.backend.servicedependency;

import com.itsm.backend.company.Company;
import com.itsm.backend.company.CompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final ServiceDependencyRepository dependencyRepository;
    private final CompanyRepository companyRepository;

    public ServiceRequestService(ServiceRequestRepository serviceRequestRepository,
                                 ServiceDependencyRepository dependencyRepository,
                                 CompanyRepository companyRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.dependencyRepository = dependencyRepository;
        this.companyRepository = companyRepository;
    }

    public List<ServiceRequest> getServicesByCompany(String companyId) {
        return serviceRequestRepository.findByCompanyId(companyId);
    }

    @Transactional
    public ServiceRequest createService(ServiceRequest serviceRequest, String companyId) {
        Company company = companyRepository.findById(companyId).orElseThrow();
        serviceRequest.setCompany(company);
        serviceRequest.setCompanyId(companyId);
        return serviceRequestRepository.save(serviceRequest);
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
    public List<ServiceRequest> getImpactedServices(Long assetId) {
        List<ServiceDependency> deps = dependencyRepository.findByAssetId(assetId);
        List<Long> serviceIds = deps.stream()
                .map(ServiceDependency::getServiceId)
                .distinct()
                .collect(Collectors.toList());
        return serviceRequestRepository.findAllById(serviceIds);
    }
}
