package com.itsm.backend.config;

import com.itsm.backend.admin.company.Company;
import com.itsm.backend.admin.company.CompanyRepository;
import com.itsm.backend.admin.user.User;
import com.itsm.backend.admin.user.UserRepository;
import com.itsm.backend.admin.commoncode.CommonCode;
import com.itsm.backend.admin.commoncode.CommonCodeRepository;
import com.itsm.backend.servicecatalog.ServiceCatalog;
import com.itsm.backend.servicecatalog.ServiceCatalogRepository;
import com.itsm.backend.servicecatalog.CatalogField;
import com.itsm.backend.servicecatalog.CatalogFieldRepository;
import com.itsm.backend.knowledge.Knowledge;
import com.itsm.backend.knowledge.KnowledgeRepository;
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
    @Autowired private CatalogFieldRepository catalogFieldRepository;
    @Autowired private KnowledgeRepository knowledgeRepository;
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

        // 4. SERVICE CATALOGS (Structured)
        if (serviceCatalogRepository.count() == 0) {
            User admin = userRepository.findById("admin").orElse(null);

            // 1) 신규 하드웨어 신청 (New Laptop Request)
            ServiceCatalog laptop = buildServiceCatalog(companyA, "신규 하드웨어 신청", "IT Hardware", "💻", 
                "업무에 필요한 노트북 장비를 신청합니다.", admin, "IT Support", 48, new java.math.BigDecimal("1500000"), "MEDIUM");
            serviceCatalogRepository.save(laptop);
            saveField(laptop, "laptop_model", "모델명", "TEXT", true, 1);
            saveField(laptop, "justification", "사유", "TEXT", true, 2);
            saveField(laptop, "office_loc", "수령 사무실", "SELECT", true, 3, "[\"Seoul\", \"Busan\", \"Pangyo\"]");

            // 2) VPN 권한 신청 (VPN Access Grant)
            ServiceCatalog vpn = buildServiceCatalog(companyA, "VPN 권한 신청", "Network", "🌐", 
                "원격 근무를 위한 VPN 접근 권한을 신청합니다.", admin, "Network Team", 4, java.math.BigDecimal.ZERO, "HIGH");
            serviceCatalogRepository.save(vpn);
            saveField(vpn, "region", "접속 지역", "SELECT", true, 1, "[\"Asia\", \"Europe\", \"US\"]");
            saveField(vpn, "reason", "접속 사유", "TEXT", true, 2);

            // 3) MS Office 설치 (MS Office Install)
            ServiceCatalog office = buildServiceCatalog(companyA, "MS Office 설치", "Software", "💿", 
                "MS Office 라이선스 및 설치를 요청합니다.", admin, "IT Support", 8, new java.math.BigDecimal("300000"), "LOW");
            serviceCatalogRepository.save(office);
            saveField(office, "version", "버전", "SELECT", true, 1, "[\"Office 2021\", \"Microsoft 365\"]");
            saveField(office, "asset_tag", "자산번호", "TEXT", true, 2);

            // 4) 신입사원 온보딩 (New Employee Onboarding)
            ServiceCatalog onboarding = buildServiceCatalog(companyA, "신입사원 온보딩", "HR / IT", "👤", 
                "신규 입사자의 계정 및 장비 세팅을 요청합니다.", admin, "HR Support", 24, java.math.BigDecimal.ZERO, "MEDIUM");
            serviceCatalogRepository.save(onboarding);
            saveField(onboarding, "emp_name", "성명", "TEXT", true, 1);
            saveField(onboarding, "dept", "부서", "SELECT", true, 2, "[\"Sales\", \"R&D\", \"HR\", \"Finance\"]");
            saveField(onboarding, "start_date", "입사 예정일", "DATE", true, 3);

            // 5) 건물 출입 카드 (Building Access Card)
            ServiceCatalog accessCard = buildServiceCatalog(companyA, "건물 출입 카드", "Facilities", "💳", 
                "사무실 출입 카드를 발급 또는 갱신 요청합니다.", admin, "Security Team", 72, new java.math.BigDecimal("10000"), "LOW");
            serviceCatalogRepository.save(accessCard);
            saveField(accessCard, "card_type", "발급 유형", "SELECT", true, 1, "[\"New\", \"Renewal\", \"Replacement\"]");
            saveField(accessCard, "emp_id", "사번", "TEXT", true, 2);
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

    private ServiceCatalog buildServiceCatalog(Company company, String name, String category, String icon, String desc, 
                                               User owner, String group, int sla, java.math.BigDecimal cost, String urgency) {
        ServiceCatalog c = new ServiceCatalog();
        c.setCompany(company); c.setCatalogName(name); c.setCategory(category);
        c.setIcon(icon); c.setDescription(desc);
        c.setServiceOwner(owner); c.setFulfillmentGroup(group); c.setSlaHours(sla);
        c.setEstimatedCost(cost); c.setDefaultUrgency(urgency);
        c.setIsPublished(true);
        return c;
    }

    private void saveField(ServiceCatalog catalog, String name, String label, String type, boolean req, int order) {
        saveField(catalog, name, label, type, req, order, null);
    }

    private void saveField(ServiceCatalog catalog, String name, String label, String type, boolean req, int order, String options) {
        CatalogField f = new CatalogField();
        f.setCatalog(catalog); f.setFieldName(name); f.setFieldLabel(label);
        f.setFieldType(type); f.setRequired(req); f.setFieldOrder(order);
        f.setFieldOptions(options);
        catalogFieldRepository.save(f);
    }
}
