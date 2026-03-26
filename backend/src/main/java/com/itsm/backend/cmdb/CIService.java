package com.itsm.backend.cmdb;

import com.itsm.backend.auth.SecurityUtils;
import com.itsm.backend.tenant.TenantRepository;
import com.itsm.backend.tenant.Tenant;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CIService {

    private final CIRepository ciRepository;
    private final TenantRepository tenantRepository;

    public CIService(CIRepository ciRepository, TenantRepository tenantRepository) {
        this.ciRepository = ciRepository;
        this.tenantRepository = tenantRepository;
    }

    public List<ConfigurationItem> getAllCIs() {
        String role = SecurityUtils.getCurrentRole();
        if ("ROLE_ADMIN".equals(role)) {
            return ciRepository.findAll();
        }
        String tenantId = SecurityUtils.getCurrentTenantId();
        return ciRepository.findByTenant_TenantId(tenantId);
    }

    public ConfigurationItem getCIById(Long id) {
        return ciRepository.findById(id).orElseThrow();
    }

    @Transactional
    public ConfigurationItem createCI(ConfigurationItem ci) {
        String tenantId = SecurityUtils.getCurrentTenantId();
        Tenant tenant = tenantRepository.findById(tenantId).orElseThrow();
        ci.setTenant(tenant);
        return ciRepository.save(ci);
    }

    @Transactional
    public ConfigurationItem updateCI(Long id, ConfigurationItem details) {
        ConfigurationItem ci = ciRepository.findById(id).orElseThrow();
        // Tenant Check
        String tenantId = SecurityUtils.getCurrentTenantId();
        if (!ci.getTenant().getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized to update this CI");
        }
        ci.setName(details.getName());
        ci.setType(details.getType());
        ci.setStatus(details.getStatus());
        ci.setLocation(details.getLocation());
        ci.setOwner(details.getOwner());
        return ciRepository.save(ci);
    }

    @Transactional
    public void deleteCI(Long id) {
        ConfigurationItem ci = ciRepository.findById(id).orElseThrow();
        // Tenant Check
        String tenantId = SecurityUtils.getCurrentTenantId();
        if (!ci.getTenant().getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized to delete this CI");
        }
        ciRepository.delete(ci);
    }
}
