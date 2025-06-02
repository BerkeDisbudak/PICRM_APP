/*
  # Create trend analysis table

  1. New Tables
    - `trend_analysis`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `trends` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `trend_analysis` table
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS trend_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  trends text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trend_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own trend analysis"
  ON trend_analysis
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trend analysis"
  ON trend_analysis
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);