package com.itsm.backend.config;

import com.itsm.backend.tenant.Tenant;
import com.itsm.backend.tenant.User;
import com.itsm.backend.code.CommonCode;
import com.itsm.backend.catalog.ServiceCatalog;
import com.itsm.backend.tenant.UserRepository;
import com.itsm.backend.catalog.ServiceCatalogRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private EntityManager em;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceCatalogRepository serviceCatalogRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        Tenant systemTenant;
        if (userRepository.findByUserId("admin").isEmpty()) {
            systemTenant = new Tenant();
            systemTenant.setTenantId("system");
            systemTenant.setTenantName("System Admin");
            systemTenant.setTier("Premium");
            systemTenant.setIsActive(true);
            systemTenant.setCreatedAt(java.time.LocalDateTime.now());
            em.persist(systemTenant);

            Tenant customerTenant = new Tenant();
            customerTenant.setTenantId("tenant_a");
            customerTenant.setTenantName("Customer A");
            customerTenant.setTier("Standard");
            customerTenant.setIsActive(true);
            customerTenant.setCreatedAt(java.time.LocalDateTime.now());
            em.persist(customerTenant);

            User admin = new User();
            admin.setUserId("admin");
            admin.setTenant(systemTenant);
            admin.setPassword("{noop}admin123");
            admin.setUserName("Super Admin");
            admin.setRole("ROLE_ADMIN");
            admin.setEmail("admin@itsm.sys");
            em.persist(admin);

            String[][] codes = {
                {"REQ_STATUS_OPEN", "REQ_STATUS", "신규 접수", "1"},
                {"REQ_STATUS_ASSIGNED", "REQ_STATUS", "담당자 할당", "2"},
                {"REQ_STATUS_IN_PROGRESS", "REQ_STATUS", "처리 중", "3"},
                {"REQ_STATUS_RESOLVED", "REQ_STATUS", "조치 완료", "4"},
                {"REQ_STATUS_CLOSED", "REQ_STATUS", "종료/승인", "5"}
            };
            
            for (String[] c : codes) {
                CommonCode sc = new CommonCode();
                sc.setCodeId(c[0]);
                sc.setGroupCode(c[1]);
                sc.setCodeName(c[2]);
                sc.setSortOrder(Integer.parseInt(c[3]));
                sc.setIsUse(true);
                em.persist(sc);
            }
        } else {
            systemTenant = userRepository.findByUserId("admin").get().getTenant();
        }

        if (serviceCatalogRepository.count() == 0) {
            ServiceCatalog hardwareCatalog = new ServiceCatalog();
            hardwareCatalog.setTenant(systemTenant);
            hardwareCatalog.setCatalogName("Request New Hardware");
            hardwareCatalog.setDescription("Order a new laptop, monitor, or other hardware accessories.");
            hardwareCatalog.setCategory("Hardware IT");
            hardwareCatalog.setFormSchema("[{\"name\":\"deviceType\",\"label\":\"Device Type\",\"type\":\"select\",\"options\":[\"Laptop\",\"Monitor\",\"Mouse\"]},{\"name\":\"justification\",\"label\":\"Business Justification\",\"type\":\"textarea\"}]");
            hardwareCatalog.setIsPublished(true);
            em.persist(hardwareCatalog);

            ServiceCatalog softwareCatalog = new ServiceCatalog();
            softwareCatalog.setTenant(systemTenant);
            softwareCatalog.setCatalogName("Software Installation");
            softwareCatalog.setDescription("Request installation of approved software.");
            softwareCatalog.setCategory("Software IT");
            softwareCatalog.setFormSchema("[{\"name\":\"softwareName\",\"label\":\"Software Name\",\"type\":\"text\"},{\"name\":\"licenseRequired\",\"label\":\"Requires License?\",\"type\":\"checkbox\"}]");
            softwareCatalog.setIsPublished(true);
            em.persist(softwareCatalog);
        }
    }
}
