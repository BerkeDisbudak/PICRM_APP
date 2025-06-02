/*
  # Create notifications table

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `message` (text, required)
      - `type` (enum: alert, insight, trend-up, trend-down)
      - `created_at` (timestamp with timezone)
      - `read` (boolean)

  2. Security
    - Enable RLS on notifications table
    - Add policies for:
      - Authenticated users can read all notifications
      - Only service role can create/update notifications
*/

-- Create enum type for notification types
CREATE TYPE notification_type AS ENUM ('alert', 'insight', 'trend-up', 'trend-down');

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type notification_type NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for reading notifications
CREATE POLICY "Allow authenticated users to read notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for creating notifications (service role only)
CREATE POLICY "Allow service role to create notifications"
  ON notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create policy for updating notifications (service role only)
CREATE POLICY "Allow service role to update notifications"
  ON notifications
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);