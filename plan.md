# ITIL v5 기반 ITSM 솔루션 개발 계획서 (MSP 관점)

## 1. 개요
* **목적**: ITIL v5 프랙티스를 포괄하며 다수의 고객사(MSP 형태)를 지원하는 차세대 ITSM 솔루션 구축
* **개발 패러다임**: 클린 아키텍처, 베스트 프랙티스 개발 표준 적용, 높은 확장성과 유지보수성 확보
* **주요 목표**:
  * **고객 경험 중심 설계**: 인간 중심 디자인(Human-Centered Design)을 기반으로 사용자 경험(UX) 관리를 핵심 실무에 포함
  * **가치 중심 프레임워크**: 전략, 서비스, 제품, 경험을 하나로 연결하여 비즈니스 성과(Outcome)를 도출
  * MSP 관점의 멀티 테넌시(Multi-Tenancy) 지원
  * 공통 코드 기반의 유연한 시스템 설계
  * 모니터링 도구(Prometheus, Grafana)와의 밀접한 통합
  * 인증/인가 및 세분화된 권한 관리 체계 확립

## 2. 개발 및 테스트 환경 (풀 컨테이너 환경)
* **H/W 및 OS**: Mac Mini M4 (개발), Linux (운영 타겟 환경)
* **인프라/컨테이너**: 로컬 종속성(Node.js, JDK 등) 없이 **Docker 및 docker-compose** 기반으로 Frontend, Backend 빌드와 구동을 100% 컨테이너화하여 일관성 보장
* **Frontend**: Node.js 기반 프레임워크 (Vite + React.js / Vue.js 등) - Dockerfile(Multi-stage)을 통한 빌드 및 배포
  * **해상도**: **1280 * 1024** 해상도에 최적화, 더 큰 화면에서는 자동 확장(Auto) 지원
  * **UI/UX 디자인**: 최근 트렌드를 반영한 가독성 높고 세련된 **엣지 있는(Edgy) 다크 모드(Dark Theme)** 기본 적용
  * **스타일링**: TailwindCSS 또는 최신 UI 컴포넌트 라이브러리를 활용해 고급스럽고 직관적인 인터페이스 구축
* **Backend**: Java 17+ & Spring Boot 3.x - Dockerfile(Gradle build)을 통한 컨테이너 환경 빌드 및 실행
* **Database**: MariaDB / PostgreSQL 동시 지원
  * JPA(Hibernate) Dialect를 활용하여 DB 종속성 최소화
  * Database Migration Tool (Flyway / Liquibase) 적용
* **Monitoring**: Prometheus (메트릭 수집) + Grafana (대시보드 시각화)

## 3. 핵심 요구사항 및 기능 상세

### 3.1 공통 모듈 및 권한 관리 (인증/인가)
* **로그인 및 권한**: JWT(JSON Web Token) 및 Spring Security 기반의 로그인 구현.
* **사용자 분리**: 시스템 관리자(Admin), 내부 직원(Agent), 고객사 사용자(User) 등 RBAC(Role-Based Access Control) 적용.
* **공통 코드 관리**: 상태 값, 티켓 카테고리, 우선순위 등 시스템 내의 하드코딩을 배제하고 `공통 코드(Common Code)` 테이블에서 일괄 관리. (조회 성능 강화를 위해 내부 캐시 적용 검토)

### 3.2 MSP 다중 고객사 관리 (Multi-Tenancy)
* 여러 고객사 데이터를 한 시스템에서 관리하기 위한 아키텍처 적용.
* 테넌트 식별자(Tenant ID) 및 데이터 필터링(Row-level 분리 또는 Schema 분리) 적용.
* 고객사별 맞춤형 접근 제어 및 서비스 제공.

### 3.3 ITIL v5 핵심 프랙티스 및 액티비티

초기에는 가장 수요가 높은 `서비스 요청 관리`를 집중 개발하되, 이후 ITIL v5의 핵심 프랙티스들을 포괄하는 통합 ITSM 솔루션으로 전체 기능을 확장합니다.

**1) 대시보드 (Dashboard)**
* **목표**: 방대한 IT 운영 상황, SLA 달성 건전성, 개별 티켓 현황에 대한 빠르고 직관적인 통합 시각화 기능 제공
* **액티비티**: 사용자 권한(전체 관리자/에이전트/일반 사용자)별 맞춤형 레이아웃 및 위젯(Widget) 동적 매핑 구성 -> 파이 차트, 바 차트 기반의 미결/지연 티켓 통계 그래픽 렌더링 -> 정기/비정기 기간별 실적 리포트(CSV, PDF 포맷) 내보내기 기능 지원

**2) 나의 요청 항목 (My Requests)**
* **목표**: 개별 사용자가 요청한 서비스 항목의 진행 상태를 실시간으로 확인하고 후속 조치(추가 정보 입력, 피드백 등)를 수행
* **액티비티**: 내가 신청한 SR/장애 티켓 목록 조회 -> 진행 상태별 필터링 -> 승인 대기 또는 추가 정보 요청 건에 대한 응답 및 대화 기능

**3) 서비스 카탈로그 (Service Catalog)**
* **목표**: 고객사 권한/등급에 맞게 제공 가능한 IT 서비스 포트폴리오를 표준화하여 게시
* **액티비티**: 카탈로그 아이템 정의 및 카테고리화 -> 동적 입력 폼(Form) 구성 및 승인 결재선 지정 -> 사용자 웹 포털에 게시

**4) 서비스 요청 관리 (Service Request Management)**
* **목표**: 사용자 요청(권한 신청, S/W 설치 등)의 최적화된 접수 및 표준 처리
* **액티비티**: 카탈로그 아이템 선택 기반의 요청 등록 -> 사용자/문서 정보에 입각한 자동 할당 및 승인 처리 -> 작업 수행 -> 완료 및 피드백 수집

**5) 이벤트 관리 (Event Management)**
* **목표**: 인프라 및 서비스 전반에서 발생하는 모든 상태 변화(이벤트)를 수집, 분류하고 불필요한 노이즈를 필터링
* **액티비티**: 외부 모니터링 툴(Prometheus/Grafana 등)의 알람(Webhook) 수신 -> 로직에 따른 심각도 분류(Severity) 및 상관관계 분석 -> 임계치 초과 건은 '장애 티켓(Incident)'으로 연동/발행

**6) 장애 관리 (Incident Management)**
* **목표**: 예기치 않은 서비스 중단 또는 품질 저하를 최대한 빠르게 복구하여 비즈니스 영향을 최소화
* **액티비티**: 사용자 직접 신고 접수 또는 이벤트 관리 자동 캡처 -> 티켓 우선순위(Urgency/Impact) 산정 -> 임시 해결책(Workaround) 적용 -> 빠른 서비스 정상화 및 종료 처리

**7) 문제 관리 (Problem Management)**
* **목표**: 인시던트의 근본 원인을 식별하고 재발 가능성을 근본적으로 차단
* **액티비티**: 트렌드 분석을 통한 반복/대형 장애 식별 -> 근본 원인 분석(RCA, Root Cause Analysis) -> 알려진 오류(Known Error) 관리 및 DB 등재 -> 영구적 해결책(Permanent Fix) 패치 도출

**8) 변경 관리 (Change Management)**
* **목표**: IT 서비스나 인프라 환경 변경 시 발생할 수 있는 비즈니스 위험 요소를 선제 파악 및 안전하게 통제
* **액티비티**: 일반/표준/긴급 등 변경 유형에 따른 요청(RFC) 작성 -> 리스크 및 영향도 평가 진행 -> CAB(변경자문위원회) 회의 및 결재선 승인 

**9) 릴리스 관리 (Release Management)**
* **목표**: 승인된 변경(Change) 사항을 실제 IT 서비스 운영 환경으로 안전하게 배포하고 무결성을 보장
* **액티비티**: 릴리스 단위 및 패키지 구성 -> 배포(릴리스) 로드맵 및 장애 시 백업/롤백(Rollback) 계획 수립 -> 승인된 배포의 테스트 및 운영 적용 -> 적용 후 사후 검토(PIR)

**10) 서비스 수준 관리 (Service Level Management)**
* **목표**: 다수 고객사(MSP 형태)와 체결한 SLA 품질 지표 달성 여부를 보증하고, IT 서비스 전반의 핵심 성과 지표(KPI)를 정량적으로 추적
* **액티비티**: 고객사별/티켓 유형별 처리 제한 시간(Target Time) 정의 -> 실시간 SLA 준수율 모니터링 -> 처리 기한 도래/위반(Breach) 자동 알림 전송

**11) 자산 관리 (Asset Management)**
* **목표**: 하드웨어 리소스 및 소프트웨어 라이선스 등 전체 IT 자산의 비용, 조달, 계약 등 재무적/물리적 라이프사이클 통제
* **액티비티**: 신규 자산 원장 DB 등록 -> 라이선스 할당 수량 및 유효성 추적 -> 재무 비용 및 협력사 유지보수 계약 관리(도입-운영-정비/감가상각-폐기)

**12) 구성 관리 (Configuration Management)**
* **목표**: IT 서비스 운영 파이프라인에 필요한 모든 구성요소(CI, Configuration Item)의 논리적 속성과 상호 의존성을 정확히 동기화 및 유지
* **액티비티**: 구성 데이터(네트워크, 애플리케이션, 장비 모델 등) 스키마 정의 -> CI 간의 상호 의존성(Relationship) 토폴로지 맵 시각화 -> 변경 작업 전후의 자동화된 구성 스냅샷(정합성) 스캔 및 비교

**13) 서비스 관리 (Service Management)**
* **목표**: 비즈니스에 제공되는 IT 서비스를 논리적 최상위 단위로 정의하고, 이를 구성하는 하부 인프라(CI)와의 연관관계를 통합적으로 설계 및 통제
* **액티비티**: IT 서비스 개념 정의 및 포트폴리오 등록 -> 서비스와 인프라 구성요소(CI: 서버, DB, 애플리케이션 등) 간의 종속성(Dependency) 매핑

**14) 지식 관리 (Knowledge Management)**
* **목표**: 조직 내 성공 경험과 기술 문서 등 지식 자산을 효과적으로 수집/공유하여 작업자의 문제 해결 속도 극대화
* **액티비티**: 성공적으로 해결 처리된 장애/요청 티켓의 지식 기반 문서(KBA) 이관 작업 -> 관리자 검토 및 승인 라인 통과 -> 사용자 지원 포털을 통한 자가 해결(Self-Service) 튜토리얼 지원

**15) 시스템 관리 (System Administration)**
* **목표**: 다중 고객사(MSP) 기반 시스템 운영을 위한 기초 데이터를 최적화하고 전체 권한을 통제
* **액티비티**: 테넌트(고객사)/조직/부서 등록 -> 사용자 및 역할(RBAC) 부여 -> 프로세스 상태 값, 분류 카테고리 등 공통 코드 집중 관리

### 3.4 모니터링 시스템 인터페이스
* **API 메트릭 수집**: Spring Boot Actuator 및 Micrometer를 통해 자체적인 애플리케이션 상태 노출.
* **인프라 모니터링**: 대상 서버 리소스 등 지표를 Prometheus로 수집.
* **시각화**: 성능 모니터링, SLA 준수율, 비즈니스 지표(요청 처리량 등)를 Grafana 대시보드로 구성.

### 3.5 공통 파일 첨부 관리 (File Attachment Management)
* **목표**: 서비스 요청(SR) 및 장애(Incident) 등 각종 티켓 진행 시 참고용 스크린샷, 문서 등을 물리 망/로컬 스토리지에 업로드하고 식별하는 공통 통제 체계 마련.
* **접근**: MVP 단계에서는 시스템 내부(Docker Volume)에 저장하며, 엔티티 다형성을 통해 어떠한 티켓 타입(`relatedEntityType`) 에도 손쉽게 첨부파일을 매핑할 수 있는 범용적 API 및 컴포넌트 구조 구현.

## 4. 데이터베이스 테이블 명세 (ERD 초안)

시스템의 근간이 되는 핵심 테이블(테넌트, 사용자, 공통 코드, 요청 관리)에 대한 기본 속성 명세입니다. 다중 고객사 환경(MSP)을 위해 대부분의 테이블에 `tenant_id` 컬럼을 포함하여 데이터를 격리합니다.


## 5. 디렉토리 및 프로젝트 구조

### 5.1. 기본 방향: 모놀리식(Modular Monolith) 구조

```text
/ITSMv5
├── docker-compose.yml         # 로컬 시스템 구축 (DB, Prometheus, Grafana 등)
├── .env                       # 시스템 환경 변수 설정
├── /docs                      
│   └── api-spec.md            # API 명세서 및 시스템 설계 문서
├── /frontend                  # Node.js 기반 프론트엔드 프로젝트
│   ├── package.json
│   ├── tsconfig.json          # TypeScript 설정
│   ├── vite.config.ts         # Vite 빌드 설정
│   └── /src
│       ├── /api               # axios 인스턴스, API 호출 함수 (services 역할)
│       ├── /assets            # 이미지, 폰트, 글로벌 스타일 (CSS/SCSS)
│       ├── /components        # 재사용 가능한 UI 컴포넌트
│       │   ├── /common        # 버튼, 입력창 등 공통 컴포넌트
│       │   ├── /layout        # Header, Sidebar, Footer
│       │   └── /admin         # 관리자 전용 컴포넌트 (이미 보유 중)
│       ├── /constants         # 환경 변수, 공통 코드, 메시지 상수
│       ├── /hooks             # 커스텀 React Hooks (예: useAuth, useDropdown)
│       ├── /pages             # 라우트 단위 페이지 컴포넌트
│       │   ├── /Dashboard/
│       │   └── /Admin/
│       ├── /store             # 상태 관리 (Zustand, Redux, Context API 등)
│       ├── /types             # TypeScript 인터페이스 및 타입 정의 (.ts)
│       ├── /utils             # 순수 함수 (날짜 변환, 포맷팅 등)
│       ├── App.tsx
│       └── main.tsx
└── /backend                   # Java Spring Boot 백엔드 프로젝트
    ├── build.gradle (or pom.xml)
    ├── /src/main/java/com/itsm
    │   ├── ItsmApplication.java  # Spring Boot 애플리케이션 실행 메인 클래스
    │   ├── /config            
    │   │   ├── SecurityConfig.java   # Spring Security 및 JWT 토큰 처리 설정
    │   │   └── SwaggerConfig.java    # Swagger(OpenAPI) 명세 설정
    │   ├── /common            
    │   │   ├── GlobalExceptionHandler.java # 전역 예외(오류) 처리기
    │   │   └── ApiResponse.java      # 공통 API 응답 규격 (DTO)
    │   ├── /domain            # 주요 코어 비즈니스 도메인
    │   │   ├── /auth          
    │   │   │   └── AuthController.java     # 사용자 로그인 검증 및 토큰 발급 리시버
    │   │   ├── /code          
    │   │   │   └── CommonCodeService.java  # 공통 코드(캐시 연동) 활용 비즈니스 로직
    │   │   ├── /tenant        
    │   │   │   └── TenantRepository.java   # 테넌트(고객사) 정보 DB 접근(JPA)
    │   │   └── /request       
    │   │       ├── ServiceRequestController.java # 요청(티켓) REST API 명세
    │   │       ├── ServiceRequest.java     # 서비스요청 티켓 JPA 엔티티(Entity)
    │   │       └── RequestDto.java         # 정보 교환을 위한 데이터 전송 객체
    │   └── /integration       
    │       └── MetricsExporter.java        # 커스텀 Prometheus 지표 노출 클래스
    └── /src/main/resources
        ├── application.yml          # 기본 환경 설정 및 공통 설정
        ├── application-postgres.yml # PostgreSQL 특화 연결 프로파일
        ├── application-mariadb.yml  # MariaDB 특화 연결 프로파일
        └── /db/migration            
            └── V1__init_schema.sql  # Flyway 활용 초기 Database 스키마 마이그레이션 스크립트
```

## 6. 개발 표준 및 클린코드 적용 전략

1. **아키텍처**: 비즈니스 로직의 오염을 방지하기 위해 Controller - Service - Repository 계층을 명확히 분리하고, DTO를 통해 계층 간 데이터를 전달.
2. **Naming Rule 및 코드 컨벤션**: 구글 Java 스타일 가이드 등 사전 정의된 표준화된 코딩 컨벤션(Lint/Format) 적용.
3. **Database 독립성**: JPA 기반 JPQL/QueryDSL을 위주로 작성하여 MariaDB와 PostgreSQL 간 구문 충돌 제거 (Native Query 금지).
4. **리팩토링 및 테스트**: 
   - 주요 비즈니스 로직(특히 요청 관리 상태 전이 등)에 대해 JUnit5 및 Mockito 기반 단위 테스트 작성.
   - Testcontainers 등 활용하여 양쪽 DB 환경 통합 테스트(Integration Test) 진행.
5. **RESTful API**: 명확한 URI 설계 및 HTTP Method(GET, POST, PUT, DELETE) 활용, Swagger(OpenAPI 3.0)로 API 명세서 자동화.

## 7. 개발 일정 (Phase 단위 로드맵)

모든 모듈은 **기본적인 CRUD(Create, Read, Update, Delete) 화면과 관리 로직을 필수 포함**하여 개발됩니다.

| 단계 | 주요 작업 내용 | 일정 (예상) | 상태 | 상세 비고 |
|:---:|---|:---:|:---:|---|
| **Phase 1** | **기반 셋업**: Docker 인프라, 프로젝트 골격, 공통 Response/Exception 규격화 | 1주 | [완료] | 컨테이너 환경 및 기본 아키텍처 수립 완료 |
| **Phase 2** | **시스템 관리 (1)**: 테넌트/사용자 관리, 멀티 테넌트 격리, JWT 인증/인가 | 2주 | [완료] | 테넌트 격리 및 기초 사용자 관리 기능 완료 |
| **Phase 3** | **시스템 관리 (2)**: 공통 코드 관리 (상태/분류 코드 CRUD) | 1주 | [완료] | 관리자용 코드 관리 UI/API 완비 |
| **Phase 4** | **서비스 카탈로그**: 카탈로그 아이템 정의, 동적 폼 엔진 고도화 | 1주 | [보강 필요] | 기초 CRUD 존재하나 동적 폼 엔진 고도화 필요 |
| **Phase 5** | **서비스 요청 관리**: 요청 등록, 복합 승인 워크플로우 로직 | 2주 | [보강 필요] | 티켓 생성 가능, 복합 승인 워크플로우 로직 대기 중 |
| **Phase 6** | **나의 요청 항목**: 개인별 티켓 현황 조회 및 후속 조치 UI | 1주 | [보강 필요] | 사용자 전용 요청 관리 화면 개발 예정 |
| **Phase 7** | **이벤트 관리**: Webhook 알람 수신, 필터링 및 자동 장애 생성 | 1주 | [보강 필요] | Webhook 수신부 존재, 자동 인시던트 생성 로직 보강 중 |
| **Phase 8** | **장애 관리**: 장애 신고/접수, 서비스 영향도(BIA) 엔진 고도화 | 1주 | [보강 필요] | 기본 티켓팅 완료, 서비스 영향도(BIA) 엔진 고도화 필요 |
| **Phase 9** | **문제 관리**: 반복 장애 트렌드 분석, RCA 및 해결책 DB 관리 | 1주 | [중단/보강] | 기초 CRUD 존재, 데이터 분석 모델링 미흡 |
| **Phase 10** | **변경 관리**: RFC 작성, 리스크 평가 및 CAB 승인 프로세스 | 1주 | [보강 필요] | RFC 기초 등록 가능, 위험도 평가 및 승인 프로세스 미흡 |
| **Phase 11** | **릴리스 관리**: 배포 계획 수립, 로드맵 및 사후 검토(PIR) | 1주 | [진행중] | 초기 목록 화면 및 컴포넌트 스켈레톤 생성 완료 |
| **Phase 12** | **서비스 수준 관리**: SLA 지표 정의, 준수율 모니터링 및 알림 | 1주 | [예정] | 고객사별 Target Time 정의 및 모니터링 엔진 |
| **Phase 13** | **자산 관리**: IT 자산 원장 CRUD 및 라이프사이클 관리 | 1주 | [완료] | 전 기능 CRUD 및 UI 고도화 완료 |
| **Phase 14** | **구성 관리**: CI 간 의존성 매핑 및 CMDB 토폴로지 시각화 | 2주 | [보강 필요] | CI 데이터 구조 완료, 관계 매핑 UI/시각화 미흡 |
| **Phase 15** | **서비스 관리**: 비즈니스 서비스 정의 및 하부 인프라 종속성 매핑 | 1주 | [보강 필요] | 서비스 엔티티 완료, 인프라 연동 고도화 필요 |
| **Phase 16** | **지식 관리**: KBA 문서 작성, 승인 프로세스 및 검색 연동 | 1주 | [보강 필요] | 문서 작성/조회 가능하나 검색 및 티켓 연동 보강 필요 |
| **Phase 17** | **대시보드**: 권한별 맞춤형 실시간 위젯 동적 매핑 및 시각화 | 1주 | [예정] | 차트 위젯 및 권한별 레이아웃 엔진 개발 |
| **Phase 18** | **통합 QA 및 리포팅**: 시스템 안정화, 최종 QA 및 운영 리포트 출력 | 1주 | [예정] | 전체 모듈 통합 테스트 및 리포트(PDF/CSV) 출력 기능 |

**[참고] 전체 예상 소요 기간**: 모듈 분리 및 CRUD 고도화를 고려하여 **약 14~16주**를 목표로 합니다.

## 8. Next Step 전략
* 이 계획이 검토 및 승인되면, 프로젝트 저장소 폴더 구조 구성을 1차적으로 진행하며, `docker-compose.yml` 리소스부터 작성을 시작합니다.
