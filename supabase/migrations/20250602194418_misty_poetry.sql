/*
  # Update trend analyses table

  1. Changes
    - Create trend_analyses table with correct structure
    - Add RLS policies
    - Add necessary indexes
*/

-- Create trend_analyses table with correct structure
CREATE TABLE IF NOT EXISTS trend_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  trend text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trend_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own trends
CREATE POLICY "Users can read own trends"
  ON trend_analyses
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS trend_analyses_user_id_created_at_idx 
  ON trend_analyses(user_id, created_at DESC);