-- Create trend_analysis table
CREATE TABLE IF NOT EXISTS trend_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  trend text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trend_analysis ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own trends
CREATE POLICY "Users can read own trends"
  ON trend_analysis
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);