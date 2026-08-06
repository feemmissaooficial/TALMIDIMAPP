-- Adicionando as colunas faltantes na tabela user_diary caso ela já existisse com outro formato
ALTER TABLE user_diary ADD COLUMN IF NOT EXISTS vivido_hoje TEXT NOT NULL DEFAULT '';
ALTER TABLE user_diary ADD COLUMN IF NOT EXISTS deus_falou TEXT NOT NULL DEFAULT '';
