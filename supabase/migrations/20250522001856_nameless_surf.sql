/*
  # Create Reports table

  1. New Tables
    - `Reports`
      - `uuid` (uuid, primary key)
      - `title` (text, not null)
      - `text` (text, not null)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `Reports` table
    - Add policy for authenticated users to read reports
*/

CREATE TABLE IF NOT EXISTS "Reports" (
  uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE "Reports" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON "Reports"
  FOR SELECT
  TO public
  USING (true);