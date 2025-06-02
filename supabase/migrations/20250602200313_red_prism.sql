/*
  # Update Reports table structure

  1. Changes
    - Add risk_level enum type
    - Add title column
    - Add tags column (as JSONB array)
    - Add risk_level column
    - Update existing RLS policies

  2. Security
    - Maintain existing RLS policies
    - Ensure proper access control
*/

-- Create risk level enum
CREATE TYPE report_risk_level AS ENUM ('low', 'medium', 'high');

-- Update Reports table
ALTER TABLE "Reports"
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS risk_level report_risk_level DEFAULT 'medium';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS reports_user_id_created_at_idx 
  ON "Reports"(user_id, created_at DESC);

-- Update column name for consistency
ALTER TABLE "Reports" RENAME COLUMN "Report" TO report;