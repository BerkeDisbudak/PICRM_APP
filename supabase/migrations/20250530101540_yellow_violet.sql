-- Drop existing policies
DROP POLICY IF EXISTS "Enable all operations for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create a single policy for all operations
CREATE POLICY "Enable all operations for users based on user_id"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (auth.uid() = id);

-- Create a separate policy for INSERT
CREATE POLICY "Enable insert for authenticated users"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);