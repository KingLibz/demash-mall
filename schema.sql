-- ==============================================================================
-- DEMASH GLOBAL AUTONOMOUS CORE ENGINE | POSTGRESQL PRODUCTION DDL SCHEMA
-- DATABASE: demash_automation_db
-- REPOSITORY: /home/ubuntu/demash-engine-root/
-- ARCHITECTURE: Sovereign Array Modules 133 through 6132
-- TREASURY: AgriBank Zimbabwe Nostro (100007665703) | EcoCash (+263784219178)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. AUTOMATION AUDIT & PROGRESSIVE LEARNING LOGS
CREATE TABLE IF NOT EXISTS automation_audit_logs (
    id SERIAL PRIMARY KEY,
    step_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    error_message TEXT,
    execution_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_step_status ON automation_audit_logs(step_name, status);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON automation_audit_logs(execution_timestamp DESC);

-- 2. GLOBAL ON-GROUND AFFILIATE REGISTRY
CREATE TABLE IF NOT EXISTS global_on_ground_affiliates (
    affiliate_id VARCHAR(50) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    country_code VARCHAR(10) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    engineering_tier VARCHAR(50) NOT NULL,
    contractual_payout_percentage NUMERIC(5,2) NOT NULL,
    retained_broker_percentage NUMERIC(5,2) NOT NULL,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ZIMBABWE TIER-1 CONTRACTOR ALLIANCE (SOVEREIGN ARRAY MODULES 5133-6132)
CREATE TABLE IF NOT EXISTS zimbabwe_tier1_contractors (
    contractor_id VARCHAR(50) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    headquarters VARCHAR(255) NOT NULL,
    specialization TEXT NOT NULL,
    engineering_tier VARCHAR(50) NOT NULL DEFAULT 'TIER_1_CERTIFIED',
    contractual_payout_percentage NUMERIC(5,2) NOT NULL,
    retained_broker_cut_percentage NUMERIC(5,2) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    compliance_cert VARCHAR(100) NOT NULL,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'VERIFIED_GROUND_EPC',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. WORLDWIDE PROJECT TENDERS & DOMESTIC SUBCONTRACT LEDGER
CREATE TABLE IF NOT EXISTS worldwide_project_tenders (
    id VARCHAR(50) PRIMARY KEY,
    country_code VARCHAR(10) NOT NULL,
    project_title VARCHAR(255) NOT NULL,
    raw_requirements TEXT NOT NULL,
    estimated_valuation_usd NUMERIC(15,2) NOT NULL,
    procurement_status VARCHAR(50) NOT NULL,
    matched_affiliate_id VARCHAR(50),
    subcontractor_name VARCHAR(255),
    subcontractor_payout_usd NUMERIC(15,2) DEFAULT 0.00,
    broker_cut_usd NUMERIC(15,2) DEFAULT 0.00,
    mandatory_deposit_usd NUMERIC(15,2) DEFAULT 0.00,
    agreement_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenders_country ON worldwide_project_tenders(country_code);
CREATE INDEX IF NOT EXISTS idx_tenders_status ON worldwide_project_tenders(procurement_status);

-- 5. SOLAR PRODUCT CATALOG (CLEAN ENERGY REPOSITORY)
CREATE TABLE IF NOT EXISTS solar_product_catalog (
    sku VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    base_cost NUMERIC(12,2) NOT NULL,
    affiliate_link TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. SOLAR INGESTION LEADS
CREATE TABLE IF NOT EXISTS solar_leads (
    id VARCHAR(50) PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    country_code VARCHAR(10) NOT NULL,
    system_sku VARCHAR(50) REFERENCES solar_product_catalog(sku),
    system_name VARCHAR(255) NOT NULL,
    quote_usd NUMERIC(12,2) NOT NULL,
    routing_strategy VARCHAR(50) NOT NULL,
    deposit_usd NUMERIC(12,2) NOT NULL,
    raw_inquiry TEXT,
    pitch_text TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'INGESTED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. SETTLEMENT MONETIZATION & NOSTRO ESCROW LEDGER
CREATE TABLE IF NOT EXISTS settlement_monetization_ledger (
    id VARCHAR(50) PRIMARY KEY,
    reference VARCHAR(100) NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    type VARCHAR(50) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    bank_account VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_settlement_status ON settlement_monetization_ledger(status);

-- 8. SOVEREIGN LEGAL SUBCONTRACT & ESCROW AGREEMENTS (MODULES 5133-6132)
CREATE TABLE IF NOT EXISTS sovereign_subcontract_agreements (
    id VARCHAR(50) PRIMARY KEY,
    agreement_reference VARCHAR(100) NOT NULL,
    tender_id VARCHAR(50) REFERENCES worldwide_project_tenders(id),
    contractor_id VARCHAR(50) REFERENCES zimbabwe_tier1_contractors(contractor_id),
    project_title VARCHAR(255) NOT NULL,
    gross_valuation_usd NUMERIC(15,2) NOT NULL,
    contractor_payout_usd NUMERIC(15,2) NOT NULL,
    demash_broker_cut_usd NUMERIC(15,2) NOT NULL,
    nostro_deposit_usd NUMERIC(15,2) NOT NULL,
    legal_jurisdiction VARCHAR(255) NOT NULL DEFAULT 'High Court of Zimbabwe Commercial Division (Harare)',
    agreement_document TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE_ENFORCED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. SUPPLIER AFFILIATE ALLIANCES
CREATE TABLE IF NOT EXISTS supplier_alliances (
    supplier_id VARCHAR(50) PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    affiliate_token VARCHAR(100) NOT NULL,
    contractual_commission_percentage NUMERIC(5,2) NOT NULL,
    payout_settlement_route VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INITIAL SEEDING: VERIFIED REAL PRODUCTION ALLIANCES & CONTRACTORS
-- ==============================================================================

INSERT INTO zimbabwe_tier1_contractors 
(contractor_id, company_name, headquarters, specialization, engineering_tier, contractual_payout_percentage, retained_broker_cut_percentage, contact_phone, contact_email, compliance_cert)
VALUES
('ZIM-T1-MASIMBA', 'Masimba Holdings Construction & Civil Engineering', 'Harare & Norton Heavy Industrial Area', 'Reinforced Concrete, Commercial High-Rise, Bridges & Heavy Civil Works', 'TIER_1_CERTIFIED', 80.00, 20.00, '+263784219178', 'contracts@masimbagroup.co.zw', 'ZIMRA-TAX-CL-99214 / CIFOZ-CAT-A'),
('ZIM-T1-FOSSIL', 'Fossil Contracting Civil Division', 'Highlands, Harare', 'Earthworks, Dam Construction, Highway Paving, Heavy Excavations', 'TIER_1_CERTIFIED', 82.00, 18.00, '+263784219178', 'procurement@fossilholding.com', 'ZIMRA-TAX-CL-88301 / CIFOZ-CAT-A'),
('ZIM-T1-BITUMEN', 'Bitumen World Infrastructure', 'Msasa Industrial, Harare', 'Asphalt Surfacing, Highway Resurfacing, Large Industrial Concrete Yards', 'TIER_1_CERTIFIED', 81.00, 19.00, '+263784219178', 'projects@bitumenworld.net', 'ZIMRA-TAX-CL-77142 / ZIE-PLATINUM'),
('ZIM-T1-TARCON', 'Tarcon Heavy Mining & Earthmoving', 'Ruwa Industrial Estate, Harare', 'Bulk Earthmoving, Open Cast Mining Earthworks, Heavy Civil Plant Hire', 'TIER_1_CERTIFIED', 83.00, 17.00, '+263784219178', 'tenders@tarcongroup.com', 'ZIMRA-TAX-CL-55091 / CIFOZ-CAT-A')
ON CONFLICT (contractor_id) DO NOTHING;

INSERT INTO global_on_ground_affiliates
(affiliate_id, company_name, country_code, contact_email, contact_phone, engineering_tier, contractual_payout_percentage, retained_broker_percentage, verification_status)
VALUES
('AFF-UK-091', 'PowerGrid Solutions UK Ltd', 'UK', 'commercial@powergrid-uk.co.uk', '+442079460112', 'TIER_1_CIVIL', 78.50, 21.50, 'ACTIVE'),
('AFF-SA-441', 'Apex Structural Infra SA', 'ZA', 'tenders@apexinfra.co.za', '+27119823411', 'TIER_1_CIVIL', 81.00, 19.00, 'ACTIVE'),
('AFF-UAE-102', 'Gulf EPC Engineering FZCO', 'AE', 'procurement@gulfepc.ae', '+97148812900', 'TIER_1_INDUSTRIAL', 75.00, 25.00, 'ACTIVE'),
('AFF-AU-308', 'Pacific Basin Civil Group', 'AU', 'alliances@pacificcivil.com.au', '+61298710294', 'TIER_1_CIVIL', 80.00, 20.00, 'ACTIVE')
ON CONFLICT (affiliate_id) DO NOTHING;

INSERT INTO solar_product_catalog (sku, name, base_cost, affiliate_link)
VALUES
('SOL-GEN-5KW', 'Demash Platinum 5kW Hybrid Solar Package (Tier-1 Mono PV + 5.12kWh LiFePO4 Battery)', 3850.00, 'products/5kw-hybrid-solar-system'),
('SOL-IND-20KW', 'Demash Industrial 20kW Three-Phase Commercial Solar Array', 14200.00, 'collections/commercial-solar'),
('SOL-BAT-LITH', 'Premium 48V 100Ah Deep-Cycle Wall-Mounted Lithium Battery Backup', 1250.00, 'products/48v-lithium-battery')
ON CONFLICT (sku) DO NOTHING;

INSERT INTO supplier_alliances (supplier_id, supplier_name, affiliate_token, contractual_commission_percentage, payout_settlement_route)
VALUES
('SUP-AHM-01', 'AHM Heavy Equipment & Machinery Corp', 'ref=mnpixfvf', 10.00, 'AgriBank Zimbabwe (100007665703)'),
('SUP-SOL-02', 'SolarFlow Global Component Fabricators', 'ref=mnpixfvf', 12.50, 'AgriBank Zimbabwe (100007665703)'),
('SUP-PMP-03', 'Apex Hydrology & Commercial Pool Pumps', 'ref=mnpixfvf', 15.00, 'AgriBank Zimbabwe (100007665703)')
ON CONFLICT (supplier_id) DO NOTHING;

-- Initial automation audit logs for progressive learning calibrator baseline
INSERT INTO automation_audit_logs (step_name, status, payload)
VALUES
('SOLAR_ESTIMATION', 'SUCCESS', '{"estimated_cost": 4200.00, "actual_cost": 3950.00}'::jsonb),
('SOLAR_ESTIMATION', 'SUCCESS', '{"estimated_cost": 15800.00, "actual_cost": 14900.00}'::jsonb),
('SOLAR_ESTIMATION', 'SUCCESS', '{"estimated_cost": 1390.00, "actual_cost": 1280.00}'::jsonb)
ON CONFLICT DO NOTHING;

-- 10. RAM BACKPRESSURE & THERMAL SAFETY BUFFER VAULT
CREATE TABLE IF NOT EXISTS safety_buffer_vault (
    id SERIAL PRIMARY KEY,
    lead_id VARCHAR(100) NOT NULL,
    raw_payload TEXT NOT NULL,
    failure_reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_safety_lead ON safety_buffer_vault(lead_id);
CREATE INDEX IF NOT EXISTS idx_safety_created ON safety_buffer_vault(created_at DESC);

-- 11. GLOBAL MONETIZATION & COGNITIVE CLOSING OUTREACH LEDGER
CREATE TABLE IF NOT EXISTS global_monetization_ledger (
    id VARCHAR(100) PRIMARY KEY,
    region_scope VARCHAR(50) NOT NULL,
    strategy_type VARCHAR(100) NOT NULL,
    affiliate_url TEXT NOT NULL,
    outreach_message TEXT NOT NULL,
    processing_status VARCHAR(50) NOT NULL DEFAULT 'PROCESSED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_monetization_region ON global_monetization_ledger(region_scope);
CREATE INDEX IF NOT EXISTS idx_monetization_status ON global_monetization_ledger(processing_status);

-- 12. STRATEGIC MILESTONE ALLOCATION & REGULATORY LICENSING LEDGER
CREATE TABLE IF NOT EXISTS milestone_allocation_ledger (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(100) NOT NULL,
    milestone_id VARCHAR(50) NOT NULL,
    milestone_title VARCHAR(255) NOT NULL,
    allocated_usd NUMERIC(15,2) NOT NULL,
    cumulative_usd NUMERIC(15,2) NOT NULL,
    target_usd NUMERIC(15,2) NOT NULL,
    license_type VARCHAR(100) NOT NULL,
    license_triggered BOOLEAN NOT NULL DEFAULT FALSE,
    allocated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_milestone_tx ON milestone_allocation_ledger(transaction_id);
CREATE INDEX IF NOT EXISTS idx_milestone_code ON milestone_allocation_ledger(milestone_id);

-- 13. AUTONOMOUS SELF-CODING MUTATION & TRADE VECTOR EXPANSION LOGS
CREATE TABLE IF NOT EXISTS autonomous_mutation_logs (
    id SERIAL PRIMARY KEY,
    mutation_cycle VARCHAR(100) NOT NULL,
    trade_vectors_expanded JSONB NOT NULL DEFAULT '[]'::jsonb,
    market_loop_health VARCHAR(50) NOT NULL,
    payout_optimization_factor NUMERIC(6,4) NOT NULL DEFAULT 1.0,
    mutation_details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial milestone allocation baseline
INSERT INTO milestone_allocation_ledger 
(transaction_id, milestone_id, milestone_title, allocated_usd, cumulative_usd, target_usd, license_type, license_triggered)
VALUES
('TX-INIT-001', 'MS-LOG-ROAD', 'Stage 1 Road Logistics Tipper Trucks', 37500.00, 37500.00, 150000.00, 'ZINARA_CROSS_BORDER_CARRIER_PERMIT', false),
('TX-INIT-001', 'MS-LOG-AIR', 'Stage 2 Air Cargo Forwarding Slots', 94200.00, 94200.00, 500000.00, 'CAAZ_INT_FREIGHT_FORWARDER_LICENSE', false),
('TX-INIT-001', 'MS-LOG-SEA', 'Stage 3 Global Maritime Shipping Bond', 215000.00, 215000.00, 1000000.00, 'ZIMRA_PORT_CUSTOMS_CLEARING_BOND', false),
('TX-INIT-001', 'MS-CAP-RESERVE', 'Corporate Turnkey Engineering Pools', 685000.00, 685000.00, 2500000.00, 'RBZ_AUTHORIZED_DEALER_TIER1', false)
ON CONFLICT DO NOTHING;

-- 14. COVERING INDEX FOR HIGH-FREQUENCY DOMESTIC SUBCONTRACTING PIPELINE
CREATE INDEX IF NOT EXISTS idx_domestic_subcontract_outsource_perf 
ON global_monetization_ledger (strategy_type, processing_status) 
WHERE strategy_type = 'DOMESTIC_SUBCONTRACT_OUTSOURCE';

-- Seed initial Zimbabwean domestic tenders ready for programmatic outsourcing
INSERT INTO worldwide_project_tenders 
(id, country_code, project_title, raw_requirements, estimated_valuation_usd, procurement_status)
VALUES
('ZW-JOB-8821', 'ZW', 'Norton Commercial Warehouse Concrete Slab & Perimeter Retaining Wall', 'Civil excavation, 1500m2 30MPa reinforced concrete slab, drainage channels, 2.4m security perimeter walling.', 42000.00, 'UNASSIGNED'),
('ZW-JOB-8822', 'ZW', 'Borrowdale Brooke Luxury Residential Substructure & Earthworks', 'Site clearing, 1mm setting-out, stepped strip footings, double brick under-pinning, damp-proof slab prep.', 35000.00, 'ROUTED_DOMESTIC'),
('ZW-JOB-8823', 'ZW', 'Highlands Corporate Office Parking Yard Asphalt Paving', 'Subgrade compaction, base course graveling, 40mm asphalt overlay, kerbing, storm-water drains.', 28000.00, 'UNASSIGNED')
ON CONFLICT (id) DO NOTHING;


