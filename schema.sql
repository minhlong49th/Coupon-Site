-- schema.sql

-- Define Enums
CREATE TYPE "CouponStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'PENDING', 'REJECTED');
CREATE TYPE "CouponType" AS ENUM ('PERCENT', 'FIXED', 'FREE_SHIPPING', 'BOGO', 'OTHER');

-- Create "users" table
CREATE TABLE users (
    id VARCHAR(191) PRIMARY KEY,
    clerk_id VARCHAR(191) UNIQUE NOT NULL,
    username VARCHAR(191) UNIQUE NOT NULL,
    email VARCHAR(191) UNIQUE NOT NULL,
    karma INT NOT NULL DEFAULT 0,
    is_banned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create "brands" table
CREATE TABLE brands (
    id VARCHAR(191) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    logo_url VARCHAR(2048),
    affiliate_url VARCHAR(2048) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create "coupons" table
CREATE TABLE coupons (
    id VARCHAR(191) PRIMARY KEY,
    brand_id VARCHAR(191) NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    code VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type "CouponType" NOT NULL,
    discount_value DOUBLE PRECISION,
    affiliate_url VARCHAR(2048) NOT NULL,
    status "CouponStatus" NOT NULL DEFAULT 'PENDING',
    expires_at TIMESTAMP WITH TIME ZONE,
    success_rate INT NOT NULL DEFAULT 0,
    use_count INT NOT NULL DEFAULT 0,
    click_count INT NOT NULL DEFAULT 0,
    upvotes INT NOT NULL DEFAULT 0,
    downvotes INT NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    submitter_id VARCHAR(191) REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (brand_id, code)
);

-- Create "audit_logs" table
CREATE TABLE audit_logs (
    id VARCHAR(191) PRIMARY KEY,
    admin_id VARCHAR(191),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(191) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for performance
CREATE INDEX idx_users_karma ON users(karma);
CREATE INDEX idx_brands_category ON brands(category);
CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_coupons_status ON coupons(status);
CREATE INDEX idx_coupons_brand_id ON coupons(brand_id);
CREATE INDEX idx_coupons_expires_at ON coupons(expires_at);
CREATE INDEX idx_coupons_is_featured ON coupons(is_featured);
CREATE INDEX idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
