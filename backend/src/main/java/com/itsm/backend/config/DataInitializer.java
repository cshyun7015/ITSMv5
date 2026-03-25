package com.itsm.backend.config;

import com.itsm.backend.tenant.Tenant;
import com.itsm.backend.tenant.User;
import com.itsm.backend.code.CommonCode;
import com.itsm.backend.catalog.ServiceCatalog;
import com.itsm.backend.catalog.ServiceCatalogRepository;
import com.itsm.backend.knowledge.KnowledgeArticle;
import com.itsm.backend.knowledge.KnowledgeArticleRepository;
import com.itsm.backend.request.ServiceRequest;
import com.itsm.backend.request.ServiceRequestRepository;
import com.itsm.backend.incident.Incident;
import com.itsm.backend.incident.IncidentRepository;
import com.itsm.backend.change.ChangeRequest;
import com.itsm.backend.change.ChangeRequestRepository;
import com.itsm.backend.tenant.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private EntityManager em;
    @Autowired private UserRepository userRepository;
    @Autowired private ServiceCatalogRepository serviceCatalogRepository;
    @Autowired private KnowledgeArticleRepository knowledgeArticleRepository;
    @Autowired private ServiceRequestRepository serviceRequestRepository;
    @Autowired private IncidentRepository incidentRepository;
    @Autowired private ChangeRequestRepository changeRequestRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        // ===== 1. TENANTS & USERS =====
        Tenant systemTenant;
        Tenant tenantA;
        Tenant tenantB;

        if (userRepository.findByUserId("admin").isEmpty()) {
            systemTenant = buildTenant("system", "System Admin (MSP)", "Premium");
            tenantA     = buildTenant("tenant_a", "ACME Corporation", "Premium");
            tenantB     = buildTenant("tenant_b", "Beta Startup Inc.", "Standard");
            em.persist(systemTenant);
            em.persist(tenantA);
            em.persist(tenantB);

            em.persist(buildUser("admin",   systemTenant, "Super Admin",   "ROLE_ADMIN",    "admin@msp.sys"));
            em.persist(buildUser("eng01",   tenantA,      "김민준 Engineer", "ROLE_ENGINEER", "minjun@acme.co"));
            em.persist(buildUser("user01",  tenantA,      "이서연 사원",      "ROLE_USER",     "seoyeon@acme.co"));
            em.persist(buildUser("user02",  tenantB,      "박지호 대리",      "ROLE_USER",     "jiho@beta.startup"));

            String[][] codes = {
                {"REQ_STATUS_OPEN",        "REQ_STATUS", "신규 접수",   "1"},
                {"REQ_STATUS_ASSIGNED",    "REQ_STATUS", "담당자 할당", "2"},
                {"REQ_STATUS_IN_PROGRESS", "REQ_STATUS", "처리 중",     "3"},
                {"REQ_STATUS_RESOLVED",    "REQ_STATUS", "조치 완료",   "4"},
                {"REQ_STATUS_CLOSED",      "REQ_STATUS", "종료/승인",   "5"}
            };
            for (String[] c : codes) {
                CommonCode sc = new CommonCode();
                sc.setCodeId(c[0]); sc.setGroupCode(c[1]);
                sc.setCodeName(c[2]); sc.setSortOrder(Integer.parseInt(c[3]));
                sc.setIsUse(true);
                em.persist(sc);
            }
        } else {
            systemTenant = userRepository.findByUserId("admin").get().getTenant();
            tenantA = userRepository.findByUserId("eng01").map(User::getTenant).orElse(systemTenant);
            tenantB = userRepository.findByUserId("user02").map(User::getTenant).orElse(systemTenant);
        }

        // ===== 2. SERVICE CATALOGS =====
        if (serviceCatalogRepository.count() == 0) {
            em.persist(buildCatalog(tenantA, "Request New Hardware",     "Hardware IT",  "Order a new laptop, monitor, or other hardware accessories.",
                "[{\"name\":\"deviceType\",\"label\":\"Device Type\",\"type\":\"select\",\"options\":[\"Laptop\",\"Monitor\",\"Mouse\",\"Keyboard\"]},{\"name\":\"justification\",\"label\":\"Business Justification\",\"type\":\"textarea\"}]"));
            em.persist(buildCatalog(tenantA, "Software Installation",   "Software IT",  "Request installation of approved software.",
                "[{\"name\":\"softwareName\",\"label\":\"Software Name\",\"type\":\"text\"},{\"name\":\"licenseRequired\",\"label\":\"Requires License?\",\"type\":\"checkbox\"}]"));
            em.persist(buildCatalog(tenantA, "VPN Access Request",       "Network IT",   "Request VPN access for remote work.",
                "[{\"name\":\"reason\",\"label\":\"Reason for VPN Access\",\"type\":\"textarea\"},{\"name\":\"duration\",\"label\":\"Duration (days)\",\"type\":\"number\"}]"));
            em.persist(buildCatalog(tenantA, "ID/Password Reset",        "Account Mgmt", "Reset your corporate account credentials.",
                "[{\"name\":\"accountId\",\"label\":\"Account ID\",\"type\":\"text\"}]"));
        }
        em.flush();

        // ===== 3. KPI SERVICE REQUESTS (realistic distribution) =====
        if (serviceRequestRepository.count() == 0) {
            var admin = userRepository.findByUserId("admin").get();
            var cat   = serviceCatalogRepository.findByIsPublishedTrue().stream().findFirst().orElse(null);
            if (cat != null) {
                // Resolved (SLA achieved)
                String[][] resolved = {
                    {"노트북 교체 요청 - 홍길동",       "REQ_STATUS_RESOLVED", "High",   "-5"},
                    {"소프트웨어 설치 - AutoCAD 2024",  "REQ_STATUS_RESOLVED", "Medium", "-3"},
                    {"VPN 접속 권한 요청 - 출장 용무",   "REQ_STATUS_RESOLVED", "Medium", "-7"},
                    {"모니터 추가 요청 - 재택근무 장비",  "REQ_STATUS_RESOLVED", "Low",    "-10"},
                    {"Slack Enterprise 라이선스 요청",  "REQ_STATUS_RESOLVED", "Medium", "-2"},
                    {"키보드 불량 교체 요청",             "REQ_STATUS_RESOLVED", "Low",    "-14"},
                    {"비밀번호 초기화 요청 - 계정 잠금", "REQ_STATUS_RESOLVED", "High",   "-1"},
                    {"개발 도구 설치 - IntelliJ IDEA",  "REQ_STATUS_RESOLVED", "Medium", "-6"},
                    {"VPN 계정 비활성화 - 퇴직자 조치", "REQ_STATUS_RESOLVED", "Medium", "-8"},
                    {"웹캠 구매 요청 - 화상 회의용",     "REQ_STATUS_RESOLVED", "Low",    "-12"},
                };
                for (String[] r : resolved) {
                    ServiceRequest sr = new ServiceRequest();
                    sr.setTitle(r[0]); sr.setStatus(r[1]); sr.setPriority(r[2]);
                    sr.setDescription("사용자의 " + r[0] + " 요청이 처리되었습니다.");
                    sr.setFormData("{}"); sr.setCatalog(cat);
                    sr.setRequester(admin); sr.setTenant(tenantA);
                    sr.setCreatedAt(LocalDateTime.now().plusDays(Long.parseLong(r[3])));
                    serviceRequestRepository.save(sr);
                }
                // In Progress
                String[][] inprog = {
                    {"MacBook Pro 요청 - 디자인팀 신규 입사자", "REQ_STATUS_IN_PROGRESS", "High"},
                    {"Adobe Creative Suite 설치 요청",          "REQ_STATUS_IN_PROGRESS", "Medium"},
                    {"네트워크 스위치 구성 변경 요청",            "REQ_STATUS_IN_PROGRESS", "High"},
                };
                for (String[] r : inprog) {
                    ServiceRequest sr = new ServiceRequest();
                    sr.setTitle(r[0]); sr.setStatus(r[1]); sr.setPriority(r[2]);
                    sr.setDescription(r[0]); sr.setFormData("{}"); sr.setCatalog(cat);
                    sr.setRequester(admin); sr.setTenant(tenantA);
                    sr.setCreatedAt(LocalDateTime.now().minusDays(1));
                    serviceRequestRepository.save(sr);
                }
                // Open (new)
                String[][] open = {
                    {"외장 SSD 구매 요청 - 영업팀 백업용",   "REQ_STATUS_OPEN", "Low"},
                    {"Zoom Webinar 라이선스 추가 요청",      "REQ_STATUS_OPEN", "Medium"},
                };
                for (String[] r : open) {
                    ServiceRequest sr = new ServiceRequest();
                    sr.setTitle(r[0]); sr.setStatus(r[1]); sr.setPriority(r[2]);
                    sr.setDescription(r[0]); sr.setFormData("{}"); sr.setCatalog(cat);
                    sr.setRequester(admin); sr.setTenant(tenantA);
                    sr.setCreatedAt(LocalDateTime.now().minusHours(3));
                    serviceRequestRepository.save(sr);
                }
            }
        }

        // ===== 4. KPI INCIDENTS =====
        if (incidentRepository.count() == 0) {
            var admin = userRepository.findByUserId("admin").get();
            Object[][] incidents = {
                {"전사 이메일 서버 다운 - Office 365 장애",       "INC_RESOLVED", "Critical", "Service-wide",  -3},
                {"ERP 시스템 응답 없음 - 업무 중단",               "INC_RESOLVED", "High",     "Department",    -7},
                {"Wi-Fi 불안정 - 4층 회의실 전 구역",              "INC_RESOLVED", "Medium",   "Department",    -2},
                {"개발 서버 접속 불가 - SSH 포트 차단",            "INC_RESOLVED", "High",     "Individual",    -5},
                {"프린터 오류 - 재무팀 문서 출력 불가",             "INC_RESOLVED", "Low",      "Individual",    -1},
                {"VPN 연결 장애 - 재택근무 직원 전원 영향",         "INC_IN_PROGRESS", "Critical", "Service-wide", 0},
                {"데이터베이스 슬로우 쿼리 - 고객 포털 지연",       "INC_IN_PROGRESS", "High",     "Service-wide", 0},
                {"신규 직원 계정 생성 오류 - HR 시스템 연동 실패",  "INC_OPEN",    "Medium",   "Individual",    0},
            };
            for (Object[] inc : incidents) {
                Incident i = new Incident();
                i.setTitle((String) inc[0]); i.setStatus((String) inc[1]);
                i.setPriority((String) inc[2]); i.setImpact((String) inc[3]);
                i.setDescription(i.getTitle() + " - MSP에 의해 감지된 장애입니다.");
                i.setTenant(tenantA); i.setTenantId("tenant_a");
                i.setReporter(admin); i.setReporterId("admin");
                i.setCreatedAt(LocalDateTime.now().plusDays((int) inc[4]));
                if ("INC_RESOLVED".equals(inc[1])) {
                    i.setResolvedAt(LocalDateTime.now().plusDays((int) inc[4] + 1));
                }
                incidentRepository.save(i);
            }
        }

        // ===== 5. KPI CHANGE REQUESTS =====
        if (changeRequestRepository.count() == 0) {
            var admin = userRepository.findByUserId("admin").get();
            Object[][] changes = {
                {"분기별 보안 패치 적용 - Windows Server 2022",      "CHG_COMPLETED", "Standard",  "Low",    -14},
                {"네트워크 방화벽 정책 업데이트",                       "CHG_COMPLETED", "Normal",    "Medium", -10},
                {"클라우드 스토리지 용량 증설 (AWS S3)",               "CHG_APPROVED",  "Normal",    "Low",    -3},
                {"ERP 버전 업그레이드 v7.1 → v8.0",                  "CHG_REVIEW",    "Normal",    "High",   -2},
                {"긴급 DNS 설정 변경 - 서비스 라우팅 오류 대응",        "CHG_COMPLETED", "Emergency", "High",   -7},
                {"신규 직원 온보딩 - AD 계정 그룹 정책 변경",           "CHG_IN_PROGRESS","Standard", "Low",    0},
                {"백업 솔루션 교체 - Veeam → Commvault",             "CHG_DRAFT",     "Normal",    "High",   0},
            };
            for (Object[] chg : changes) {
                ChangeRequest cr = new ChangeRequest();
                cr.setTitle((String) chg[0]); cr.setStatus((String) chg[1]);
                cr.setChangeType((String) chg[2]); cr.setRisk((String) chg[3]);
                cr.setDescription((String) chg[0] + " 에 대한 RFC 입니다.");
                cr.setRollbackPlan("이전 버전/설정으로 롤백. 변경 이전 스냅샷 확보 완료.");
                cr.setTenant(tenantA); cr.setTenantId("tenant_a");
                cr.setRequester(admin); cr.setRequesterId("admin");
                cr.setCreatedAt(LocalDateTime.now().plusDays((int) chg[4]));
                changeRequestRepository.save(cr);
            }
        }

        // ===== 6. KNOWLEDGE BASE =====
        if (knowledgeArticleRepository.count() == 0) {
            var admin = userRepository.findByUserId("admin").get();
            Object[][] kbas = {
                {"VPN 설정 가이드 (Windows/macOS)", "Network", 214,
                    "# VPN 설정 방법\n\n## Windows\n1. 설정 > 네트워크 및 인터넷 > VPN 클릭\n2. VPN 연결 추가 후 서버 주소 입력\n3. 자격증명 입력 후 연결\n\n## macOS\n1. 시스템 설정 > VPN\n2. VPN 구성 추가 > IKEv2 선택\n3. IT팀이 제공한 서버 주소와 원격 ID 입력"},
                {"Active Directory 비밀번호 초기화 방법", "Account", 387,
                    "# 비밀번호 초기화\n\n잠금 계정은 셀프서비스 포털을 통해 해제 가능합니다.\n\n**접속 URL:** https://password.corp.local\n\n1. 직원 ID 입력\n2. 등록된 휴대폰으로 OTP 수신\n3. 새 비밀번호 설정 (8자 이상, 특수문자 포함)"},
                {"노트북 기본 세팅 가이드 (신규입사자용)", "Hardware", 156,
                    "# 신규 노트북 초기 세팅\n\n1. 전원 켜기 및 도메인 가입 (corp.local)\n2. 회사 소프트웨어 설치: Office 365, Slack, Zoom\n3. 업무용 이메일 설정 (Outlook)\n4. VPN 클라이언트 설치\n5. 보안 에이전트 (CrowdStrike) 설치 확인"},
                {"ERP 시스템 접속 오류 해결 방법 Top 5", "Software", 502,
                    "# ERP 접속 오류 해결 가이드\n\n## 1. 로그인 불가\n- 비밀번호 오입력 잠금 시 IT헬프데스크에 연락\n\n## 2. 화면 로딩 지연\n- 브라우저 캐시 삭제 후 재시도\n- IE 대신 Chrome 또는 Edge 사용\n\n## 3. 502 Bad Gateway\n- 서버 점검 중일 수 있음. 10분 후 재시도\n\n## 4. 출력 오류\n- 프린터 드라이버 재설치 필요\n\n## 5. 엑셀 다운로드 실패\n- Pop-up 차단 해제 필요"},
                {"재택근무 보안 수칙 Top 10",            "Security", 98,
                    "# 재택근무 보안 수칙\n\n1. 반드시 VPN 연결 후 업무 시스템 접근\n2. 공용 Wi-Fi 사용 금지\n3. 화면 자동 잠금 설정 (5분)\n4. 업무용 PC로 개인 SNS 접속 자제\n5. 의심스러운 이메일 첨부파일 클릭 금지\n6. USB 드라이브 보안 정책 준수\n7. 화상 통화 시 배경 확인 (민감 정보 노출 방지)\n8. 소프트웨어 임의 설치 금지 (IT 승인 필요)\n9. 업무 종료 후 PC 종료\n10. 보안 인시던트 발생 시 즉시 helpdesk@corp.local 신고"},
            };
            for (Object[] kba : kbas) {
                KnowledgeArticle a = new KnowledgeArticle();
                a.setTitle((String) kba[0]); a.setCategory((String) kba[1]);
                a.setViewCount((int) kba[2]); a.setContent((String) kba[3]);
                a.setTenant(tenantA); a.setAuthor(admin);
                a.setCreatedAt(LocalDateTime.now().minusDays(7));
                a.setUpdatedAt(LocalDateTime.now().minusDays(1));
                knowledgeArticleRepository.save(a);
            }
        }
    }

    private Tenant buildTenant(String id, String name, String tier) {
        Tenant t = new Tenant(); t.setTenantId(id); t.setTenantName(name); t.setTier(tier); t.setIsActive(true); t.setCreatedAt(LocalDateTime.now()); return t;
    }

    private User buildUser(String id, Tenant tenant, String name, String role, String email) {
        User u = new User(); u.setUserId(id); u.setTenant(tenant); u.setPassword("{noop}admin123"); u.setUserName(name); u.setRole(role); u.setEmail(email); return u;
    }

    private ServiceCatalog buildCatalog(Tenant tenant, String name, String category, String desc, String schema) {
        ServiceCatalog c = new ServiceCatalog(); c.setTenant(tenant); c.setCatalogName(name); c.setCategory(category); c.setDescription(desc); c.setFormSchema(schema); c.setIsPublished(true); return c;
    }
}
