package com.itsm.backend.config;

import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.company.CompanyRepository;
import com.itsm.backend.admin.user.User;
import com.itsm.backend.admin.user.UserRepository;
import com.itsm.backend.admin.commoncode.CommonCode;
import com.itsm.backend.admin.commoncode.CommonCodeRepository;
import com.itsm.backend.servicecatalog.ServiceCatalog;
import com.itsm.backend.servicecatalog.ServiceCatalogRepository;
import com.itsm.backend.knowledge.Knowledge;
import com.itsm.backend.knowledge.KnowledgeRepository;
import com.itsm.backend.servicerequest.ServiceRequest;
import com.itsm.backend.servicerequest.ServiceRequestRepository;
import com.itsm.backend.incident.Incident;
import com.itsm.backend.incident.IncidentRepository;
import com.itsm.backend.change.Change;
import com.itsm.backend.change.ChangeRepository;
import com.itsm.backend.asset.Asset;
import com.itsm.backend.asset.AssetRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private CompanyRepository companyRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ServiceCatalogRepository serviceCatalogRepository;
    @Autowired private KnowledgeRepository knowledgeRepository;
    @Autowired private ServiceRequestRepository serviceRequestRepository;
    @Autowired private IncidentRepository incidentRepository;
    @Autowired private ChangeRepository changeRepository;
    @Autowired private AssetRepository assetRepository;
    @Autowired private CommonCodeRepository commonCodeRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. COMPANIES
        Company systemCompany = createCompanyIfAbsent("system", "System Admin (MSP)", "Premium");
        Company companyA = createCompanyIfAbsent("company_a", "ACME Corporation", "Premium");
        Company companyB = createCompanyIfAbsent("company_b", "Beta Startup Inc.", "Standard");

        // 2. USERS
        createUserIfAbsent("admin", systemCompany, "Super Admin", "ROLE_ADMIN", "admin@msp.sys");
        createUserIfAbsent("eng01", companyA, "김민준 Engineer", "ROLE_ENGINEER", "minjun@acme.co");
        createUserIfAbsent("user01", companyA, "이서연 사원", "ROLE_USER", "seoyeon@acme.co");
        createUserIfAbsent("user02", companyB, "박지호 대리", "ROLE_USER", "jiho@beta.startup");

        // 3. COMMON CODES
        String[][] codes = {
            {"REQ_STATUS_OPEN", "REQ_STATUS", "신규 접수", "1"},
            {"REQ_STATUS_ASSIGNED", "REQ_STATUS", "담당자 할당", "2"},
            {"REQ_STATUS_IN_PROGRESS", "REQ_STATUS", "처리 중", "3"},
            {"REQ_STATUS_RESOLVED", "REQ_STATUS", "조치 완료", "4"},
            {"REQ_STATUS_CLOSED", "REQ_STATUS", "종료/승인", "5"},
            {"INC_STATUS_OPEN", "INC_STATUS", "신규 장애", "1"},
            {"INC_STATUS_IN_PROGRESS", "INC_STATUS", "장애 처리중", "2"},
            {"INC_STATUS_RESOLVED", "INC_STATUS", "장애 조치완료", "3"},
            {"INC_STATUS_CLOSED", "INC_STATUS", "장애 종료", "4"},
            {"CHG_STATUS_DRAFT", "CHG_STATUS", "임시 저장", "1"},
            {"CHG_STATUS_REQUESTED", "CHG_STATUS", "변경 요청", "2"},
            {"CHG_STATUS_REVIEW", "CHG_STATUS", "검토 중", "3"},
            {"CHG_STATUS_APPROVED", "CHG_STATUS", "승인 완료", "4"},
            {"CHG_STATUS_IN_PROGRESS", "CHG_STATUS", "변경 작업중", "5"},
            {"CHG_STATUS_COMPLETED", "CHG_STATUS", "변경 완료", "6"},
            {"PRIO_CRITICAL", "PRIORITY", "최긴급(Critical)", "1"},
            {"PRIO_HIGH", "PRIORITY", "긴급(High)", "2"},
            {"PRIO_MEDIUM", "PRIORITY", "보통(Medium)", "3"},
            {"PRIO_LOW", "PRIORITY", "낮음(Low)", "4"},
            {"CI_TYPE_SERVER", "CI_TYPE", "서버", "1"},
            {"CI_TYPE_LAPTOP", "CI_TYPE", "노트북", "2"},
            {"CI_TYPE_NETWORK", "CI_TYPE", "네트워크 장비", "3"},
            {"CI_TYPE_STORAGE", "CI_TYPE", "스토리지", "4"},
            {"CI_TYPE_SOFTWARE", "CI_TYPE", "소프트웨어", "5"},
            {"CI_STAT_IN_USE", "CI_STATUS", "사용 중", "1"},
            {"CI_STAT_IN_STOCK", "CI_STATUS", "재고품", "2"},
            {"CI_STAT_REPAIR", "CI_STATUS", "수리 중", "3"},
            {"CI_STAT_DISPOSED", "CI_STATUS", "폐기됨", "4"}
        };
        for (String[] c : codes) {
            createCommonCodeIfAbsent(c[0], c[1], c[2], Integer.parseInt(c[3]));
        }

        // 4. SERVICE CATALOGS
        if (serviceCatalogRepository.count() == 0) {
            serviceCatalogRepository.save(buildServiceCatalog(companyA, "신규 하드웨어 신청", "장비/기기", "💻", "업무에 필요한 노트북, 모니터 등의 장비를 신청합니다.",
                "[{\"name\":\"deviceType\",\"label\":\"장비 종류\",\"type\":\"select\",\"options\":[\"노트북\",\"모니터\",\"도킹스테이션\"]},{\"name\":\"justification\",\"label\":\"사유\",\"type\":\"textarea\"}]"));
            serviceCatalogRepository.save(buildServiceCatalog(companyA, "소프트웨어 설치", "SW/앱", "💿", "라이선스가 필요한 상용 소프트웨어 설치를 요청합니다.",
                "[{\"name\":\"softwareName\",\"label\":\"SW 명칭\",\"type\":\"text\"},{\"name\":\"licenseKey\",\"label\":\"라이선스 보유 여부\",\"type\":\"checkbox\"}]"));
        }

        // 5. KNOWLEDGE
        if (knowledgeRepository.count() == 0) {
            var admin = userRepository.findById("admin").orElse(null);
            if (admin != null) {
                Knowledge a = new Knowledge();
                a.setTitle("VPN 설정 가이드 (Windows/macOS)"); a.setCategory("Network");
                a.setViewCount(214); a.setContent("# VPN 설정 방법\n\n...");
                a.setCompany(companyA); a.setAuthor(admin);
                a.setCreatedAt(LocalDateTime.now().minusDays(7));
                knowledgeRepository.save(a);
            }
        }
    }

    private Company createCompanyIfAbsent(String id, String name, String tier) {
        return companyRepository.findById(id).orElseGet(() -> {
            Company t = new Company();
            t.setCompanyId(id); t.setCompanyName(name); t.setTier(tier);
            t.setIsActive(true); t.setCreatedAt(LocalDateTime.now());
            return companyRepository.save(t);
        });
    }

    private User createUserIfAbsent(String id, Company company, String name, String role, String email) {
        return userRepository.findById(id).orElseGet(() -> {
            User u = new User();
            u.setUserId(id); u.setCompany(company);
            u.setPassword("{noop}admin123"); u.setUserName(name); u.setRole(role); u.setEmail(email);
            return userRepository.save(u);
        });
    }

    private CommonCode createCommonCodeIfAbsent(String id, String group, String name, int sortOrder) {
        return commonCodeRepository.findById(id).orElseGet(() -> {
            CommonCode sc = new CommonCode();
            sc.setCodeId(id); sc.setGroupCode(group);
            sc.setCodeName(name); sc.setSortOrder(sortOrder);
            sc.setIsUse(true);
            return commonCodeRepository.save(sc);
        });
    }

    private ServiceCatalog buildServiceCatalog(Company company, String name, String category, String icon, String desc, String schema) {
        ServiceCatalog c = new ServiceCatalog();
        c.setCompany(company); c.setCatalogName(name); c.setCategory(category);
        c.setIcon(icon); c.setDescription(desc); c.setFormSchema(schema);
        c.setIsPublished(true);
        return c;
    }
}
