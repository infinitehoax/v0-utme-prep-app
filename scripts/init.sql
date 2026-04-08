-- Drop existing table if it exists to avoid conflicts
DROP TABLE IF EXISTS leaderboard CASCADE;

-- Create leaderboard table for UTME app
CREATE TABLE leaderboard (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE,
  average_percentage DECIMAL(5, 2) NOT NULL,
  total_attempts INTEGER NOT NULL DEFAULT 1,
  last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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

-- Allow public update
CREATE POLICY "Allow public update" ON leaderboard
  FOR UPDATE USING (true) WITH CHECK (true);
