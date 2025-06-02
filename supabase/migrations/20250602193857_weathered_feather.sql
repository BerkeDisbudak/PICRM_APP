/*
  # Create trends_analyzer table

  1. New Tables
    - `trends_analyzer`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `trends` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policy for users to read their own trends
*/

CREATE TABLE IF NOT EXISTS trends_analyzer (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  trends text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trends_analyzer ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own trends
CREATE POLICY "Users can read own trends"
  ON trends_analyzer
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS trends_analyzer_user_id_created_at_idx 
  ON trends_analyzer(user_id, created_at DESC);