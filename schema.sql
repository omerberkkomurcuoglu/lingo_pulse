-- ==========================================================
-- LingoApp PostgreSQL Schema
-- Supabase / Standalone PostgreSQL için Hazır SQL Şeması
-- ==========================================================

-- 1. Kelimeler Tablosu (Master Vocabulary Table)
CREATE TABLE IF NOT EXISTS words (
    id SERIAL PRIMARY KEY,
    word VARCHAR(100) NOT NULL UNIQUE,
    phonetic VARCHAR(100),
    translation VARCHAR(255) NOT NULL,
    part_of_speech VARCHAR(50),
    level VARCHAR(10) DEFAULT 'A1', -- A1, A2, B1, B2, C1
    sample_en TEXT,
    sample_tr TEXT,
    mnemonic_hint TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Kullanıcı Kelime İlerleme Tablosu (User Progress Table)
-- Durumlar: 'unseen', 'known', 'waiting', 'mastered'
CREATE TABLE IF NOT EXISTS user_word_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL DEFAULT 'local_user',
    word_id INT NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'unseen', 
    waiting_added_at TIMESTAMP WITH TIME ZONE,
    mastered_at TIMESTAMP WITH TIME ZONE,
    review_count INT DEFAULT 0,
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, word_id)
);

-- Hızlı filtreleme ve sorgulama indeksleri
CREATE INDEX IF NOT EXISTS idx_words_level ON words(level);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_word_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_progress_word ON user_word_progress(word_id);

-- RLS (Row Level Security) - Supabase için
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_word_progress ENABLE ROW LEVEL SECURITY;

-- Herkes kelimeleri okuyabilir
CREATE POLICY "Public words are viewable by everyone" 
ON words FOR SELECT USING (true);

-- Kullanıcılar kendi ilerlemelerini görebilir ve güncelleyebilir
CREATE POLICY "Users can manage their own progress" 
ON user_word_progress FOR ALL USING (true) WITH CHECK (true);
