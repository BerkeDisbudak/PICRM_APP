-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own trends" ON "Trends";

-- Enable RLS
ALTER TABLE "Trends" ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies for all operations
CREATE POLICY "Enable all operations for users based on user_id"
  ON "Trends"
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create a separate policy for INSERT
CREATE POLICY "Enable insert for authenticated users"
  ON "Trends"
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);