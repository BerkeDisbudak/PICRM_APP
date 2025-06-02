/*
  # Simplify trend system

  1. New Tables
    - `Trends`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `content` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `Trends` table
    - Add policy for users to read their own trends
*/

-- Drop existing tables
DROP TABLE IF EXISTS trend_analyses;
DROP TABLE IF EXISTS user_trends;

-- Create new Trends table
CREATE TABLE IF NOT EXISTS "Trends" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE "Trends" ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own trends
CREATE POLICY "Users can read own trends"
  ON "Trends"
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS trends_user_id_created_at_idx 
  ON "Trends"(user_id, created_at DESC);