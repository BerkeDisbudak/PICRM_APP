/*
  # Fix Reports table policies

  1. Changes
    - Add INSERT policy for authenticated users
    - Keep existing SELECT and DELETE policies
    - Maintain RLS and indexes

  2. Security
    - Enable RLS
    - Allow authenticated users to create their own reports
*/

-- Enable RLS
ALTER TABLE "Reports" ENABLE ROW LEVEL SECURITY;

-- Create policy for users to insert their own reports
CREATE POLICY "Users can insert own reports"
  ON "Reports"
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);