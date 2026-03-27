package com.itsm.backend.servicecatalog.service;

import com.itsm.backend.servicecatalog.dto.CreateServiceCatalogDTO;
import com.itsm.backend.servicecatalog.dto.ServiceCatalogResponse;
import com.itsm.backend.servicecatalog.entity.ServiceCatalog;
import com.itsm.backend.servicecatalog.mapper.ServiceCatalogMapper;
import com.itsm.backend.servicecatalog.repository.ServiceCatalogRepository;
import com.itsm.backend.company.Company;
import com.itsm.backend.company.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceCatalogService {

    private final ServiceCatalogRepository repository;
    private final CompanyRepository companyRepository;
    private final ServiceCatalogMapper mapper;

    public List<ServiceCatalogResponse> getPublishedServiceCatalogs(String companyId, String role) {
        List<ServiceCatalog> catalogs;
        if ("ROLE_ADMIN".equals(role)) {
            catalogs = repository.findByIsPublishedTrue();
        } else {
            catalogs = repository.findByCompany_CompanyIdAndIsPublishedTrue(companyId);
        }
        return catalogs.stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    public ServiceCatalogResponse getServiceCatalog(Long id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Service Catalog not found"));
    }

    public Page<ServiceCatalogResponse> getServiceCatalogsForAdmin(String search, String companyId, Pageable pageable) {
        return repository.findBySearch(search, companyId, pageable).map(mapper::toResponse);
    }

    @Transactional
    public ServiceCatalogResponse createServiceCatalog(CreateServiceCatalogDTO dto, String currentCompanyId) {
        String tId = dto.getCompanyId() != null ? dto.getCompanyId() : currentCompanyId;
        Company company = companyRepository.findById(tId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        ServiceCatalog catalog = new ServiceCatalog();
        catalog.setCompany(company);
        catalog.setCatalogName(dto.getCatalogName());
        catalog.setDescription(dto.getDescription());
        catalog.setCategory(dto.getCategory());
        catalog.setIcon(dto.getIcon());
        catalog.setFormSchema(dto.getFormSchema());
        catalog.setIsPublished(dto.getIsPublished() != null ? dto.getIsPublished() : false);

        return mapper.toResponse(repository.save(catalog));
    }

    @Transactional
    public ServiceCatalogResponse updateServiceCatalog(Long id, CreateServiceCatalogDTO dto) {
        ServiceCatalog catalog = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service Catalog not found"));

        if (dto.getCatalogName() != null) catalog.setCatalogName(dto.getCatalogName());
        if (dto.getDescription() != null) catalog.setDescription(dto.getDescription());
        if (dto.getCategory() != null) catalog.setCategory(dto.getCategory());
        if (dto.getIcon() != null) catalog.setIcon(dto.getIcon());
        if (dto.getFormSchema() != null) catalog.setFormSchema(dto.getFormSchema());
        if (dto.getIsPublished() != null) catalog.setIsPublished(dto.getIsPublished());

        return mapper.toResponse(repository.save(catalog));
    }

    @Transactional
    public void deleteServiceCatalog(Long id) {
        repository.deleteById(id);
    }
}
