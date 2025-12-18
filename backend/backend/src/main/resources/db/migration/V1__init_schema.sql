-- ==========================================
-- 1. TABLE CREATION
-- ==========================================

CREATE TABLE app_users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    payer_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    billing_cycle VARCHAR(20) NOT NULL,
    next_renewal_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sub_payer FOREIGN KEY (payer_id) REFERENCES app_users(id)
) ENGINE=InnoDB;

CREATE TABLE subscription_consumers (
    subscription_id VARCHAR(36),
    user_id VARCHAR(36),
    split_ratio DOUBLE DEFAULT 1.0,
    PRIMARY KEY (subscription_id, user_id),
    CONSTRAINT fk_con_sub FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),
    CONSTRAINT fk_con_user FOREIGN KEY (user_id) REFERENCES app_users(id)
) ENGINE=InnoDB;

CREATE TABLE ledger (
    id VARCHAR(36) PRIMARY KEY,
    debtor_id VARCHAR(36),
    creditor_id VARCHAR(36),
    amount DECIMAL(12, 2) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_led_debtor FOREIGN KEY (debtor_id) REFERENCES app_users(id),
    CONSTRAINT fk_led_creditor FOREIGN KEY (creditor_id) REFERENCES app_users(id)
) ENGINE=InnoDB;

-- ==========================================
-- 2. DUMMY DATA SEEDING
-- ==========================================

-- A. USERS (Alice, Bob, Charlie)
INSERT INTO app_users (id, email, full_name) VALUES 
('11111111-1111-1111-1111-111111111111', 'alice@test.com', 'Alice Admin'),
('22222222-2222-2222-2222-222222222222', 'bob@test.com', 'Bob Moocher'),
('33333333-3333-3333-3333-333333333333', 'charlie@test.com', 'Charlie Spender');

-- B. SUBSCRIPTIONS
-- Alice pays for Netflix ($15)
INSERT INTO subscriptions (id, payer_id, name, amount, billing_cycle, next_renewal_date) VALUES
('sub-001', '11111111-1111-1111-1111-111111111111', 'Netflix 4K', 15.00, 'MONTHLY', CURDATE() + INTERVAL 5 DAY);

-- Alice pays for Spotify Family ($20)
INSERT INTO subscriptions (id, payer_id, name, amount, billing_cycle, next_renewal_date) VALUES
('sub-002', '11111111-1111-1111-1111-111111111111', 'Spotify Family', 20.00, 'MONTHLY', CURDATE() + INTERVAL 10 DAY);

-- Bob pays for AWS Server ($50)
INSERT INTO subscriptions (id, payer_id, name, amount, billing_cycle, next_renewal_date) VALUES
('sub-003', '22222222-2222-2222-2222-222222222222', 'AWS Hosting', 50.00, 'MONTHLY', CURDATE() + INTERVAL 1 DAY);

-- C. CONSUMERS (Who uses what?)
-- Everyone uses Netflix
INSERT INTO subscription_consumers (subscription_id, user_id) VALUES 
('sub-001', '11111111-1111-1111-1111-111111111111'), 
('sub-001', '22222222-2222-2222-2222-222222222222'), 
('sub-001', '33333333-3333-3333-3333-333333333333'); 

-- Only Alice and Bob use Spotify
INSERT INTO subscription_consumers (subscription_id, user_id) VALUES 
('sub-002', '11111111-1111-1111-1111-111111111111'),
('sub-002', '22222222-2222-2222-2222-222222222222');

-- D. LEDGER (Existing Debts)
-- Bob owes Alice $5.00 for last month's Netflix
INSERT INTO ledger (id, debtor_id, creditor_id, amount, description) VALUES
('led-001', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 5.00, 'Netflix - Previous Month');

-- Charlie owes Alice $5.00 for last month's Netflix
INSERT INTO ledger (id, debtor_id, creditor_id, amount, description) VALUES
('led-002', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 5.00, 'Netflix - Previous Month');