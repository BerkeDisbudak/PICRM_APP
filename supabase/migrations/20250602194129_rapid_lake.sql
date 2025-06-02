/*
  # Create simple trends table

  1. New Tables
    - `user_trends`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `trend_text` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policy for users to read their own trends
*/

CREATE TABLE IF NOT EXISTS user_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  trend_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_trends ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own trends
CREATE POLICY "Users can read own trends"
  ON user_trends
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS user_trends_user_id_created_at_idx 
  ON user_trends(user_id, created_at DESC);