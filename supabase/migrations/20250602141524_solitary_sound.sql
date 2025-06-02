-- Rename trends column to trend
ALTER TABLE trend_analyses RENAME COLUMN trends TO trend;

-- Drop existing function as it's no longer needed
DROP FUNCTION IF EXISTS get_latest_trend;