/*
  # Fix Reports table structure

  1. Changes
    - Drop existing Reports table
    - Create new Reports table with basic structure
    - Add proper RLS policies
    - Create index for performance

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Drop existing Reports table
DROP TABLE IF EXISTS "Reports";

-- Create Reports table with minimal structure
CREATE TABLE IF NOT EXISTS "Reports" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  "Report" text,
  user_id uuid REFERENCES auth.users(id),
  title text
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