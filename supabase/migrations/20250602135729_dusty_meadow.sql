-- Drop existing function
DROP FUNCTION IF EXISTS get_latest_trend;

-- Alter trend_analyses table to add date column
ALTER TABLE trend_analyses ADD COLUMN IF NOT EXISTS trend_date DATE DEFAULT CURRENT_DATE;

-- Create updated function to get latest trend
CREATE OR REPLACE FUNCTION get_latest_trend(user_uuid uuid)
RETURNS TABLE (
  trends text,
  trend_date DATE,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT trends, trend_date, created_at
  FROM trend_analyses
  WHERE user_id = user_uuid
  ORDER BY created_at DESC
  LIMIT 1;
$$;