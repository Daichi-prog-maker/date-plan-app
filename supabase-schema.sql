-- placesテーブルの作成（行きたい場所を保存）
CREATE TABLE IF NOT EXISTS places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ご飯', 'カフェ', 'おでかけ(外)', 'おでかけ(室内)', '旅行')),
  address TEXT,
  memo TEXT,
  photo_url TEXT,
  station TEXT,
  district TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  visited BOOLEAN DEFAULT false,
  visited_date DATE,
  season TEXT CHECK (season IN ('春', '夏', '秋', '冬', '通年')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS plan_places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
CREATE INDEX IF NOT EXISTS idx_places_visited ON places(visited);
CREATE INDEX IF NOT EXISTS idx_places_station ON places(station);
CREATE INDEX IF NOT EXISTS idx_places_season ON places(season);
CREATE INDEX IF NOT EXISTS idx_plan_places_plan_id ON plan_places(plan_id);

ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_places ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS places_policy ON places;
DROP POLICY IF EXISTS plans_policy ON plans;
DROP POLICY IF EXISTS plan_places_policy ON plan_places;

CREATE POLICY places_policy ON places FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY plans_policy ON plans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY plan_places_policy ON plan_places FOR ALL USING (true) WITH CHECK (true);
