-- Drop existing table if it exists to avoid conflicts
DROP TABLE IF EXISTS leaderboard CASCADE;

-- Create leaderboard table for UTME app
CREATE TABLE leaderboard (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  average_percentage DECIMAL(5, 2) NOT NULL,
  total_attempts INTEGER NOT NULL DEFAULT 1,
  last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  device_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_leaderboard_avg ON leaderboard(average_percentage DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON leaderboard
  FOR SELECT USING (true);

-- Allow public insert
CREATE POLICY "Allow public insert" ON leaderboard
  FOR INSERT WITH CHECK (true);

-- Allow public update (only if device_token matches)
CREATE POLICY "Allow public update" ON leaderboard
  FOR UPDATE USING (device_token IS NULL OR device_token = current_setting('request.jwt.claims', true)->>'device_token')
  WITH CHECK (true);
