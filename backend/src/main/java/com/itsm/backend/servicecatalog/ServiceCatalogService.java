package com.itsm.backend.servicecatalog;

import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.company.CompanyRepository;
import com.itsm.backend.admin.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ServiceCatalogService {

    private final ServiceCatalogRepository repository;
    private final CompanyRepository companyRepository;
    private final ServiceCatalogMapper mapper;
    private final CatalogFieldRepository fieldRepository;
    private final UserRepository userRepository;

    public List<ServiceCatalogResponse> getPublishedServiceCatalogs(String companyId, String role) {
        List<ServiceCatalog> catalogs;
        if ("ROLE_ADMIN".equals(role)) {
            log.debug("[SERVICE] Admin access: fetching ALL published catalogs");
            catalogs = repository.findByIsPublishedTrue();
        } else {
            log.debug("[SERVICE] User access: fetching published catalogs for company: {}", companyId);
            catalogs = repository.findByCompany_CompanyIdAndIsPublishedTrue(companyId);
        }
        log.info("[SERVICE] Found {} published catalogs", catalogs.size());
        return catalogs.stream().map(this::enrichResponse).collect(Collectors.toList());
    }

    public ServiceCatalogResponse getServiceCatalog(Long id) {
        return repository.findById(id)
                .map(this::enrichResponse)
                .orElseThrow(() -> new RuntimeException("Service Catalog not found"));
    }

    public Page<ServiceCatalogResponse> getServiceCatalogsForAdmin(String search, String companyId, Pageable pageable) {
        return repository.findBySearch(search, companyId, pageable).map(this::enrichResponse);
    }

    @Transactional
    public ServiceCatalogResponse createServiceCatalog(CreateServiceCatalogDTO dto, String currentCompanyId) {
        String tId = dto.getCompanyId() != null ? dto.getCompanyId() : currentCompanyId;
        Company company = companyRepository.findById(tId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        ServiceCatalog catalog = mapper.mapToEntity(dto, company);
        if (dto.getOwnerId() != null) {
            catalog.setServiceOwner(userRepository.findById(dto.getOwnerId()).orElse(null));
        }

        ServiceCatalog saved = repository.save(catalog);

        if (dto.getFields() != null) {
            for (var fDto : dto.getFields()) {
                CatalogField field = new CatalogField();
                field.setCatalog(saved);
                field.setFieldName(fDto.getFieldName());
                field.setFieldLabel(fDto.getFieldLabel());
                field.setFieldType(fDto.getFieldType());
                field.setRequired(fDto.isRequired());
                field.setFieldOrder(fDto.getFieldOrder());
                field.setFieldOptions(fDto.getFieldOptions());
                fieldRepository.save(field);
            }
        }

        return enrichResponse(saved);
    }

    @Transactional
    public ServiceCatalogResponse updateServiceCatalog(Long id, CreateServiceCatalogDTO dto) {
        ServiceCatalog catalog = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service Catalog not found"));

        if (dto.getCatalogName() != null) catalog.setCatalogName(dto.getCatalogName());
        if (dto.getDescription() != null) catalog.setDescription(dto.getDescription());
        if (dto.getCategory() != null) catalog.setCategory(dto.getCategory());
        if (dto.getIcon() != null) catalog.setIcon(dto.getIcon());
        if (dto.getOwnerId() != null) {
            catalog.setServiceOwner(userRepository.findById(dto.getOwnerId()).orElse(null));
        }
        if (dto.getFulfillmentGroup() != null) catalog.setFulfillmentGroup(dto.getFulfillmentGroup());
        if (dto.getSlaHours() != null) catalog.setSlaHours(dto.getSlaHours());
        if (dto.getEstimatedCost() != null) catalog.setEstimatedCost(dto.getEstimatedCost());
        if (dto.getDefaultUrgency() != null) catalog.setDefaultUrgency(dto.getDefaultUrgency());
        if (dto.getIsPublished() != null) catalog.setIsPublished(dto.getIsPublished());

        // Update fields: simplistic approach - clear and recreate if provided
        if (dto.getFields() != null) {
            var existingFields = fieldRepository.findByCatalogOrderByFieldOrder(catalog);
            fieldRepository.deleteAll(existingFields);
            for (var fDto : dto.getFields()) {
                CatalogField field = new CatalogField();
                field.setCatalog(catalog);
                field.setFieldName(fDto.getFieldName());
                field.setFieldLabel(fDto.getFieldLabel());
                field.setFieldType(fDto.getFieldType());
                field.setRequired(fDto.isRequired());
                field.setFieldOrder(fDto.getFieldOrder());
                field.setFieldOptions(fDto.getFieldOptions());
                fieldRepository.save(field);
            }
        }

        return enrichResponse(repository.save(catalog));
    }

    @Transactional
    public void deleteServiceCatalog(Long id) {
        repository.deleteById(id);
    }

    private ServiceCatalogResponse enrichResponse(ServiceCatalog entity) {
        ServiceCatalogResponse resp = mapper.mapToResponse(entity);
        resp.setFields(fieldRepository.findByCatalogOrderByFieldOrder(entity).stream()
            .map(f -> ServiceCatalogResponse.FieldResponse.builder()
                .id(f.getId())
                .fieldName(f.getFieldName())
                .fieldLabel(f.getFieldLabel())
                .fieldType(f.getFieldType())
                .isRequired(f.isRequired())
                .fieldOrder(f.getFieldOrder())
                .fieldOptions(f.getFieldOptions())
                .build())
            .collect(Collectors.toList()));
        return resp;
    }
}
