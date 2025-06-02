/*
  # Fix Reports table structure

  1. Changes
    - Drop existing Reports table
    - Recreate Reports table with correct structure
    - Add proper RLS policies
    - Create necessary indexes
*/

-- Drop existing table
DROP TABLE IF EXISTS "Reports";

-- Create Reports table with correct structure
CREATE TABLE IF NOT EXISTS "Reports" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  title text,
  "Report" text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE "Reports" ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own reports
CREATE POLICY "Users can read own reports"
  ON "Reports"
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy for users to delete their own reports
CREATE POLICY "Users can delete own reports"
  ON "Reports"
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS reports_user_id_created_at_idx 
  ON "Reports"(user_id, created_at DESC);