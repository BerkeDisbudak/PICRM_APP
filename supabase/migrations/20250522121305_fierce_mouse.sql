/*
  # Fix Database Schema

  1. Create notifications table
    - `id` (uuid, primary key)
    - `title` (text, not null)
    - `message` (text, not null) 
    - `type` (text, check constraint for valid types)
    - `read` (boolean, default false)
    - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on notifications table
    - Add policy for public read access
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('alert', 'insight', 'trend-up', 'trend-down')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
  ON notifications
  FOR SELECT
  TO public
  USING (true);