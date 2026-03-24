package com.itsm.backend.admin;

import com.itsm.backend.tenant.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantAdminRepository extends JpaRepository<Tenant, String> {
}
