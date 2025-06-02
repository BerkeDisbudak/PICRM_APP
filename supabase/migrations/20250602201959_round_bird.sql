-- Enable RLS
ALTER TABLE "Reports" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own reports" ON "Reports";
DROP POLICY IF EXISTS "Users can delete own reports" ON "Reports";
DROP POLICY IF EXISTS "Users can insert own reports" ON "Reports";

-- Create comprehensive policies
CREATE POLICY "Enable all operations for users based on user_id"
  ON "Reports"
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);