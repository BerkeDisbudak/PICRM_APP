-- Drop existing Reports table
DROP TABLE IF EXISTS "Reports";

-- Create Reports table with correct structure
CREATE TABLE IF NOT EXISTS "Reports" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  report text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE "Reports" ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own reports
CREATE POLICY "Enable all operations for users based on user_id"
  ON "Reports"
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS reports_user_id_created_at_idx 
  ON "Reports"(user_id, created_at DESC);