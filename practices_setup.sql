-- Tabela para o Checklist Diário/Semanal de Práticas
CREATE TABLE IF NOT EXISTS user_practices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  stage_id TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  
  -- Práticas fixas
  tsd_done BOOLEAN DEFAULT false,
  intercession_done BOOLEAN DEFAULT false,
  
  -- Prática específica da estação
  specific_practice_done BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id, stage_id, day_number)
);

-- Tabela para a Pontuação (0-3) ao fim da estação
CREATE TABLE IF NOT EXISTS user_station_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  stage_id TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 3),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id, stage_id)
);

-- RLS
ALTER TABLE user_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_station_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário vê suas próprias práticas" ON user_practices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuário insere/atualiza suas próprias práticas" ON user_practices FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário vê sua pontuação" ON user_station_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuário insere/atualiza sua pontuação" ON user_station_scores FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
