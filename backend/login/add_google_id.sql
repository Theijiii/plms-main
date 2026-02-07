-- Add google_id column to users table for Google OAuth support
-- Run this SQL script if the google_id column doesn't exist yet

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) NULL DEFAULT NULL,
ADD INDEX idx_google_id (google_id);

-- Optional: Add a unique constraint if you want to prevent duplicate Google accounts
-- ALTER TABLE users ADD UNIQUE KEY unique_google_id (google_id);
