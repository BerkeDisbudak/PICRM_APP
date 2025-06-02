/*
  # Add user_id to Reports table

  1. Changes
    - Add user_id column to Reports table
    - Add foreign key constraint to auth.users
    - Update RLS policies to restrict access by user_id

  2. Security
    - Enable RLS
    - Add policy for users to read their own reports
*/

ALTER TABLE "Reports" ADD COLUMN user_id UUID REFERENCES auth.users(id);

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