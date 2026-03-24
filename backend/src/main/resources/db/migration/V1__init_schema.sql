CREATE TABLE tb_tenant (
    tenant_id VARCHAR(50) PRIMARY KEY,
    tenant_name VARCHAR(100) NOT NULL,
    tier VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_user (
    user_id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    CONSTRAINT fk_user_tenant FOREIGN KEY (tenant_id) REFERENCES tb_tenant(tenant_id)
);

CREATE TABLE tb_common_code (
    code_id VARCHAR(50) PRIMARY KEY,
    group_code VARCHAR(50) NOT NULL,
    code_name VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_use BOOLEAN NOT NULL DEFAULT TRUE
);

-- 기초 데이터 삽입 (Seed Data)
INSERT INTO tb_tenant (tenant_id, tenant_name, tier) VALUES ('system', 'System Admin', 'Premium');
INSERT INTO tb_tenant (tenant_id, tenant_name, tier) VALUES ('tenant_a', 'Customer A', 'Standard');

-- 더미 관리자 계정 생성 (테스트용)
INSERT INTO tb_user (user_id, tenant_id, password, user_name, role, email) 
VALUES ('admin', 'system', '{noop}admin123', 'Super Admin', 'ROLE_ADMIN', 'admin@itsm.sys');

-- 상태 공통코드 생성
INSERT INTO tb_common_code (code_id, group_code, code_name, sort_order) VALUES ('REQ_STATUS_OPEN', 'REQ_STATUS', '신규 접수', 1);
INSERT INTO tb_common_code (code_id, group_code, code_name, sort_order) VALUES ('REQ_STATUS_ASSIGNED', 'REQ_STATUS', '담당자 할당', 2);
INSERT INTO tb_common_code (code_id, group_code, code_name, sort_order) VALUES ('REQ_STATUS_IN_PROGRESS', 'REQ_STATUS', '처리 중', 3);
INSERT INTO tb_common_code (code_id, group_code, code_name, sort_order) VALUES ('REQ_STATUS_RESOLVED', 'REQ_STATUS', '조치 완료', 4);
INSERT INTO tb_common_code (code_id, group_code, code_name, sort_order) VALUES ('REQ_STATUS_CLOSED', 'REQ_STATUS', '종료/승인', 5);
