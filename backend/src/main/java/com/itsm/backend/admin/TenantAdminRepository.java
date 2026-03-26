package com.itsm.backend.admin;

import com.itsm.backend.tenant.Tenant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantAdminRepository extends JpaRepository<Tenant, String> {
    Page<Tenant> findByTenantNameContainingIgnoreCaseOrTenantIdContainingIgnoreCase(String name, String id, Pageable pageable);
}
