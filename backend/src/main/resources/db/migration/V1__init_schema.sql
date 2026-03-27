CREATE TABLE tb_company (
    company_id VARCHAR(50) PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    tier VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_user (
    user_id VARCHAR(50) PRIMARY KEY,
    company_id VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    CONSTRAINT fk_user_company FOREIGN KEY (company_id) REFERENCES tb_company(company_id)
);

CREATE TABLE tb_common_code (
    code_id VARCHAR(50) PRIMARY KEY,
    group_code VARCHAR(50) NOT NULL,
    code_name VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_use BOOLEAN NOT NULL DEFAULT TRUE
);
