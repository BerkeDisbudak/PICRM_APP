/*
  # Update Reports table structure

  1. Changes
    - Add 'risk_level' column with validation
    - Add 'tags' array column

  2. Security
    - Maintain existing RLS policies
*/

-- Add risk_level column with validation
ALTER TABLE "Reports"
  ADD COLUMN IF NOT EXISTS "risk_level" text CHECK (risk_level IN ('low', 'medium', 'high'));

-- Add tags array column
ALTER TABLE "Reports"
  ADD COLUMN IF NOT EXISTS "tags" text[] DEFAULT '{}';