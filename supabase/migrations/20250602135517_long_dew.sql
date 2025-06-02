-- Drop existing trend_analyses table
DROP TABLE IF EXISTS trend_analyses;

-- Create trend_analyses table with correct structure
CREATE TABLE IF NOT EXISTS trend_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  trends text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trend_analyses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own trend analyses" ON trend_analyses;
DROP POLICY IF EXISTS "Users can insert own trend analyses" ON trend_analyses;
DROP POLICY IF EXISTS "Enable all operations for users based on user_id" ON trend_analyses;

-- Create a single policy for all operations
CREATE POLICY "Enable all operations for users based on user_id"
  ON trend_analyses
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS trend_analyses_user_id_created_at_idx 
  ON trend_analyses(user_id, created_at DESC);

-- Create function to get latest trend
CREATE OR REPLACE FUNCTION get_latest_trend(user_uuid uuid)
RETURNS TABLE (trends text, created_at timestamptz)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT trends, created_at
  FROM trend_analyses
  WHERE user_id = user_uuid
  ORDER BY created_at DESC
  LIMIT 1;
$$;