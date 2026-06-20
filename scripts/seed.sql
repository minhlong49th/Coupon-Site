-- scripts/seed.sql
-- Run this script to populate the database with mock data.

-- 1. Insert Users
INSERT INTO users (id, clerk_id, username, email, karma, is_banned)
VALUES
('ADMIN', 'clerk_admin', 'admin', 'admin@example.com', 100, FALSE),
('u_abc', 'clerk_abc', 'user_abc', 'abc@example.com', 10, FALSE),
('u_123', 'clerk_123', 'user_123', '123@example.com', 5, FALSE)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Brands
INSERT INTO brands (id, name, slug, domain, logo_url, affiliate_url, category, description, created_at, updated_at)
VALUES
('1', 'Nike', 'nike', 'nike.com', 'https://img.logo.dev/nike.com?token=pk_test_placeholder', 'https://nike.com?ref=demo', 'Fashion', 'Nike is a global leader in athletic footwear.', '2024-01-15T00:00:00Z', '2026-06-01T00:00:00Z'),
('2', 'Adidas', 'adidas', 'adidas.com', 'https://img.logo.dev/adidas.com?token=pk_test_placeholder', 'https://adidas.com?ref=demo', 'Fashion', 'Adidas designs sports and lifestyle products.', '2024-01-20T00:00:00Z', '2026-06-01T00:00:00Z'),
('3', 'Udemy', 'udemy', 'udemy.com', 'https://img.logo.dev/udemy.com?token=pk_test_placeholder', 'https://udemy.com?ref=demo', 'Education', 'Udemy is the world''s largest online learning platform.', '2024-02-01T00:00:00Z', '2026-06-01T00:00:00Z'),
('4', 'Sephora', 'sephora', 'sephora.com', 'https://img.logo.dev/sephora.com?token=pk_test_placeholder', 'https://sephora.com?ref=demo', 'Beauty', 'Sephora is a prestige beauty retailer.', '2024-02-14T00:00:00Z', '2026-06-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Coupons
INSERT INTO coupons (id, brand_id, code, title, description, type, discount_value, affiliate_url, status, expires_at, success_rate, use_count, click_count, upvotes, downvotes, is_featured, submitter_id, verified_at, created_at, updated_at)
VALUES
('1', '1', 'NIKE20', '20% off sitewide', 'Valid on all regular-priced items.', 'PERCENT', 20, 'https://nike.com?ref=demo', 'ACTIVE', '2026-07-31T23:59:59Z', 87, 1243, 3821, 342, 18, true, 'ADMIN', '2026-06-10T00:00:00Z', '2026-06-01T00:00:00Z', '2026-06-10T00:00:00Z'),
('2', '1', 'FREESHIPNIKE', 'Free shipping on $75+', NULL, 'FREE_SHIPPING', NULL, 'https://nike.com?ref=demo', 'ACTIVE', NULL, 72, 892, 1204, 198, 32, false, 'ADMIN', '2026-06-05T00:00:00Z', '2026-05-15T00:00:00Z', '2026-06-05T00:00:00Z'),
('3', '2', 'ADICLUB30', '30% off for members', 'Requires adiClub membership.', 'PERCENT', 30, 'https://adidas.com?ref=demo', 'ACTIVE', '2026-06-30T23:59:59Z', 61, 445, 2109, 145, 41, false, 'ADMIN', '2026-06-01T00:00:00Z', '2026-06-01T00:00:00Z', '2026-06-01T00:00:00Z'),
('4', '3', 'LEARN12', 'Courses from $12.99', 'Limited time flash sale.', 'FIXED', 12.99, 'https://udemy.com?ref=demo', 'ACTIVE', '2026-06-20T23:59:59Z', 91, 3401, 8102, 890, 45, true, 'ADMIN', '2026-06-13T00:00:00Z', '2026-06-13T00:00:00Z', '2026-06-13T00:00:00Z'),
('5', '4', 'SEPHY10', '10% off orders $50+', NULL, 'PERCENT', 10, 'https://sephora.com?ref=demo', 'PENDING', '2026-08-15T23:59:59Z', 0, 0, 0, 0, 0, false, 'u_abc', NULL, '2026-06-14T00:00:00Z', '2026-06-14T00:00:00Z'),
('6', '1', 'NIKE20_DUP', 'Wait, this is 20% off!', 'I found this on twitter', 'PERCENT', 20, 'https://nike.com?ref=demo', 'PENDING', '2026-07-31T23:59:59Z', 0, 0, 0, 0, 0, false, 'u_123', NULL, '2026-06-15T00:00:00Z', '2026-06-15T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Audit Logs (Optional seed data)
INSERT INTO audit_logs (id, admin_id, action, entity_type, entity_id, details, created_at)
VALUES
('al_1', 'ADMIN', 'CREATE_BRAND', 'BRAND', '1', '{"name": "Nike"}', '2024-01-15T00:00:00Z'),
('al_2', 'ADMIN', 'CREATE_COUPON', 'COUPON', '1', '{"code": "NIKE20"}', '2026-06-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;
