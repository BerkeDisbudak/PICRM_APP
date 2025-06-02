-- Drop existing trend_analyses table
DROP TABLE IF EXISTS trend_analyses;

-- Create trend_analyses table with correct structure
CREATE TABLE IF NOT EXISTS trend_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  trends text NOT NULL,
  trend_date DATE DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trend_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own trends
CREATE POLICY "Users can read own trend analyses"
  ON trend_analyses
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to get latest trend
CREATE OR REPLACE FUNCTION get_latest_trend(user_uuid uuid)
RETURNS TABLE (
  trends text,
  trend_date DATE,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT trends, trend_date, created_at
  FROM trend_analyses
  WHERE user_id = user_uuid
  ORDER BY created_at DESC
  LIMIT 1;
$$;