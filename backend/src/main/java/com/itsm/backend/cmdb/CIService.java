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
}
