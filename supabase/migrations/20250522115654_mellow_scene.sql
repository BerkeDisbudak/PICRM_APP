/*
  # Create notifications table

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `message` (text, required)
      - `type` (text, required) - Possible values: 'alert', 'trend-up', 'trend-down', 'insight'
      - `read` (boolean)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `notifications` table
    - Add policies for:
      - Authenticated users can read all notifications
      - Only service role can create/update notifications
*/

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('alert', 'trend-up', 'trend-down', 'insight')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read notifications
CREATE POLICY "Users can read notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for service role to manage notifications
CREATE POLICY "Service role can manage notifications"
  ON notifications
  TO service_role
  USING (true)
  WITH CHECK (true);