-- Create leaderboard table for UTME app
CREATE TABLE IF NOT EXISTS leaderboard (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  average_percentage DECIMAL(5, 2) NOT NULL,
  total_attempts INTEGER NOT NULL DEFAULT 1,
  last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_avg ON leaderboard(average_percentage DESC);
