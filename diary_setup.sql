-- Criação da tabela para armazenar as anotações do Diário Espiritual
CREATE TABLE IF NOT EXISTS user_diary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  
  -- Campos do Diário
  vivido_hoje TEXT NOT NULL,
  deus_falou TEXT NOT NULL,
  
  -- Quando a anotação foi criada
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitando RLS (Row Level Security)
ALTER TABLE user_diary ENABLE ROW LEVEL SECURITY;

-- Políticas para garantir a privacidade do Diário (apenas o próprio usuário pode ver e inserir)
CREATE POLICY "Usuário vê seu próprio diário" ON user_diary FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuário insere em seu próprio diário" ON user_diary FOR INSERT WITH CHECK (auth.uid() = user_id);
