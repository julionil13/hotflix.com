-- Seed data for Hotflix platform
-- This script populates the database with initial categories, models, and sample content

-- Insert default categories
INSERT INTO categories (name, slug) VALUES
    ('Trending', 'trending'),
    ('New Releases', 'new-releases'),
    ('Popular', 'popular'),
    ('Exclusive', 'exclusive'),
    ('Featured', 'featured')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample models
INSERT INTO models (name, bio, profile_image_url) VALUES
    ('Sophia Belle', 'Professional model with 5+ years experience in sensual photography and videography.', '/placeholder.svg?height=400&width=400'),
    ('Isabella Rose', 'Award-winning content creator specializing in artistic and elegant presentations.', '/placeholder.svg?height=400&width=400'),
    ('Victoria Grace', 'International model known for sophisticated and captivating performances.', '/placeholder.svg?height=400&width=400'),
    ('Anastasia Moon', 'Rising star in the industry with a focus on creative and unique content.', '/placeholder.svg?height=400&width=400')
ON CONFLICT DO NOTHING;

-- Insert sample content (using model and category IDs)
WITH model_ids AS (
    SELECT id, name FROM models LIMIT 4
),
category_ids AS (
    SELECT id, name FROM categories LIMIT 5
)
INSERT INTO contents (title, description, video_url, poster_url, model_id, category_id, is_featured, view_count)
SELECT 
    'Exclusive Session: ' || m.name,
    'An intimate and artistic presentation featuring ' || m.name || ' in a beautifully crafted setting.',
    '/placeholder.svg?height=720&width=1280',
    '/placeholder.svg?height=720&width=1280',
    m.id,
    c.id,
    CASE WHEN ROW_NUMBER() OVER() <= 2 THEN TRUE ELSE FALSE END,
    FLOOR(RANDOM() * 10000 + 1000)::INTEGER
FROM model_ids m
CROSS JOIN category_ids c
LIMIT 12;
