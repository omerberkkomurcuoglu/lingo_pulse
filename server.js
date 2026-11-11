const fs = require('fs');
const path = require('path');

// .env dosyasını otomatik yükle (eğer varsa)
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const k = trimmed.slice(0, eqIdx).trim();
      const v = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      if (k && process.env[k] === undefined) {
        process.env[k] = v;
      }
    }
  }
}

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const crypto = require('crypto');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(compression());
app.use(express.json({ limit: '15mb' }));

const WORDS_10K_PATH = path.join(__dirname, 'src', 'data', 'words_10k.json');
const DATA_DIR = path.join(__dirname, 'server-data');
const STATE_PATH = path.join(DATA_DIR, 'lingo_state.json');
const LEGACY_STATE_PATH = path.join(__dirname, 'src', 'data', 'lingo_state.json');

// Admin hesabına kaydedilecek varsayılan API bilgileri (Çevre değişkenlerinden alınır)
const ADMIN_DEFAULTS = {
  gemini_api_key: process.env.GEMINI_API_KEY || '',
  api_url: process.env.API_URL || 'http://localhost:3001',
  api_url_mobile: process.env.API_URL_MOBILE || 'http://localhost:3001',
};

// ==================== BAŞARIMLAR ====================
const ACHIEVEMENTS = [
  { id: 'first_word', title: 'İlk Adım', desc: 'İlk kelimeni işaretledin', icon: 'footsteps', check: s => s.touched >= 1 },
  { id: 'words_10', title: 'Kelime Avcısı', desc: '10 kelime öğrendin', icon: 'flash', check: s => s.learned >= 10 },
  { id: 'words_100', title: 'Yüzler Kulübü', desc: '100 kelime öğrendin', icon: 'ribbon', check: s => s.learned >= 100 },
  { id: 'words_500', title: 'Sözlük Kurdu', desc: '500 kelime öğrendin', icon: 'library', check: s => s.learned >= 500 },
  { id: 'words_1000', title: 'Bin Kelime', desc: '1000 kelime öğrendin', icon: 'trophy', check: s => s.learned >= 1000 },
  { id: 'pool_25', title: 'Koleksiyoncu', desc: 'Havuzda aynı anda 25 kelime biriktirdin', icon: 'layers', check: s => s.waiting >= 25 },
  { id: 'lesson_first', title: 'İlk Ders', desc: 'İlk adım adım gramer dersini bitirdin', icon: 'book', check: s => s.lessonsDone >= 1 },
  { id: 'lesson_5', title: 'Çalışkan Öğrenci', desc: '5 gramer dersini bitirdin', icon: 'school', check: s => s.lessonsDone >= 5 },
  { id: 'exam_first_pass', title: 'Baraj Geçildi', desc: 'İlk bölüm sonu sınavını 80+ ile geçtin', icon: 'checkmark-done', check: s => s.passedTopics >= 1 },
  { id: 'exam_perfect', title: 'Kusursuz', desc: 'Bir sınavdan 100 aldın', icon: 'star', check: s => s.maxScore >= 100 },
  { id: 'checkpoint_first', title: 'Tarama Ustası', desc: 'İlk kümülatif tarama sınavını geçtin', icon: 'shield-checkmark', check: s => s.passedCheckpoints >= 1 },
  { id: 'level_a1', title: 'A1 Tamamlandı', desc: 'A1 seviyesinin tüm gramer konularını geçtin', icon: 'medal', check: s => s.completed.includes('a1-cp2') },
  { id: 'level_a2', title: 'A2 Tamamlandı', desc: 'A2 seviyesini bitirdin', icon: 'medal', check: s => s.completed.includes('a2-cp2') },
  { id: 'level_b1', title: 'B1 Tamamlandı', desc: 'B1 seviyesini bitirdin', icon: 'medal', check: s => s.completed.includes('b1-cp2') },
  { id: 'level_b2', title: 'B2 Tamamlandı', desc: 'B2 seviyesini bitirdin', icon: 'medal', check: s => s.completed.includes('b2-cp2') },
  { id: 'level_c1', title: 'C1 Tamamlandı', desc: 'C1 seviyesini bitirdin', icon: 'medal', check: s => s.completed.includes('c1-cp2') },
  { id: 'level_c2', title: 'Grandmaster', desc: 'C2 büyük final sınavını geçtin', icon: 'diamond', check: s => s.completed.includes('c2-cp1') },
];

// ==================== DURUM DEPOSU ====================
let wordsStore = [];
const wordsById = new Map();
const wordsByLevel = { A1: [], A2: [], B1: [], B2: [], C1: [], C2: [] };
const staticLevelCounts = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };

function rebuildWordIndices() {
  wordsById.clear();
  for (const k of Object.keys(wordsByLevel)) wordsByLevel[k] = [];
  for (const k of Object.keys(staticLevelCounts)) staticLevelCounts[k] = 0;
  for (const w of wordsStore) {
    wordsById.set(w.id, w);
    if (w.level) {
      if (!wordsByLevel[w.level]) wordsByLevel[w.level] = [];
      wordsByLevel[w.level].push(w);
      staticLevelCounts[w.level] = (staticLevelCounts[w.level] || 0) + 1;
    }
  }
}
let appState = {
  users: {},
  sessions: {},
  grammarCustomContents: {},
  grammarQuestionBank: {},
  chatMessages: {},
  grammarAttemptsLog: [],
};

function newUserRecord(username, password) {
  const { salt, hash } = hashPassword(password);
  return {
    username,
    salt,
    hash,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    pgId: null,
    settings: {},
    wordStatuses: {},
    grammarProgress: { completedNodeIds: [], nodeScores: {} },
    achievements: {},
  };
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, hash) {
  const candidate = crypto.scryptSync(password, salt, 64);
  const stored = Buffer.from(hash, 'hex');
  return stored.length === candidate.length && crypto.timingSafeEqual(candidate, stored);
}

// Artık hiçbir veri yerel dosyada tutulmaz: kelimeler, kullanıcılar, oturumlar, sohbet ve soru havuzları PostgreSQL'dedir.
// (Aşağıdaki dosya yolları yalnızca bir kerelik eski veriyi veritabanına taşımak için okunur, sonra silinir.)
const sleep = ms => new Promise(r => setTimeout(r, ms));

let saveTimer = null;
function saveLocalState() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(persistState, 150);
}

async function persistState() {
  if (!pgAvailable) return;
  try {
    await pool.query(
      `INSERT INTO app_state (key, value, updated_at) VALUES ('main', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();`,
      [JSON.stringify(appState)]
    );
  } catch (e) {
    console.error('Durum veritabanına kaydedilemedi:', e.message);
  }
}

// Verilen kelimeleri words_store tablosuna ekle/güncelle. front=true ise listenin başına eklenir.
async function saveWordsStore(newWords, front = false) {
  if (!pgAvailable || !Array.isArray(newWords) || newWords.length === 0) return;
  try {
    let ordBase = 0;
    if (front) {
      const r = await pool.query('SELECT COALESCE(MIN(ord), 0)::bigint AS m FROM words_store;');
      ordBase = Number(r.rows[0].m) - newWords.length - 1;
    }
    for (let i = 0; i < newWords.length; i += 500) {
      const chunk = newWords.slice(i, i + 500);
      await pool.query(
        `INSERT INTO words_store (id, ord, data)
         SELECT * FROM unnest($1::int[], $2::bigint[], $3::jsonb[])
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;`,
        [
          chunk.map(w => w.id),
          chunk.map((w, k) => ordBase + i + k),
          chunk.map(w => JSON.stringify(w)),
        ]
      );
    }
  } catch (e) {
    console.error('Kelimeler veritabanına kaydedilemedi:', e.message);
  }
}

async function loadWordsFromDb() {
  let r = await pool.query('SELECT COUNT(*)::int AS c FROM words_store;');
  if (r.rows[0].c === 0 && fs.existsSync(WORDS_10K_PATH)) {
    const list = JSON.parse(fs.readFileSync(WORDS_10K_PATH, 'utf8')).map(w => {
      const { status, ...rest } = w; // durum artık kullanıcıya özel
      return rest;
    });
    console.log(`📦 ${list.length} kelime yerel dosyadan PostgreSQL'e taşınıyor...`);
    await saveWordsStore(list, false);
  }
  r = await pool.query('SELECT data FROM words_store ORDER BY ord ASC;');
  wordsStore = r.rows.map(x => x.data);
  rebuildWordIndices();
  console.log(`📚 Kelime veritabanı PostgreSQL'den yüklendi: ${wordsStore.length} kelime (Map ve Seviye indeksleri hazır).`);
}

async function loadStateFromDb() {
  const r = await pool.query("SELECT value FROM app_state WHERE key = 'main';");
  let saved = r.rows[0] ? r.rows[0].value : null;
  let migratedFromFile = false;

  if (!saved) {
    const sourcePath = fs.existsSync(STATE_PATH)
      ? STATE_PATH
      : fs.existsSync(LEGACY_STATE_PATH)
      ? LEGACY_STATE_PATH
      : null;
    if (sourcePath) {
      try {
        saved = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
        migratedFromFile = true;
        console.log('📦 Yerel durum dosyası PostgreSQL\'e taşınıyor...');
      } catch (e) {
        console.error('Durum dosyası okunamadı:', e.message);
      }
    }
  }

  if (saved) {
    appState.users = saved.users || {};
    appState.sessions = saved.sessions || {};
    appState.grammarCustomContents = saved.grammarCustomContents || {};
    appState.grammarQuestionBank = saved.grammarQuestionBank || {};
    appState.chatMessages = saved.chatMessages || {};
    appState.grammarAttemptsLog = saved.grammarAttemptsLog || [];
    appState.quizBank = saved.quizBank || [];

    // Eski (kullanıcısız) sürümden admin hesabına taşıma
    if (!saved.users && (saved.wordStatuses || saved.grammarProgress || saved.settings)) {
      const admin = newUserRecord('admin', 'admin');
      admin.settings = { ...ADMIN_DEFAULTS, ...(saved.settings || {}) };
      admin.wordStatuses = saved.wordStatuses || {};
      admin.grammarProgress = saved.grammarProgress || { completedNodeIds: [], nodeScores: {} };
      appState.users.admin = admin;
      console.log('🔁 Eski ilerleme verileri admin hesabına taşındı.');
    }
  }

  // Admin hesabını garanti et ve API bilgilerini kaydet
  if (!appState.users.admin) {
    appState.users.admin = newUserRecord('admin', 'admin');
    console.log('👤 admin / admin hesabı oluşturuldu.');
  }
  appState.users.admin.settings = { ...ADMIN_DEFAULTS, ...appState.users.admin.settings };
  return migratedFromFile;
}

// Yerel dosyalardaki veriler veritabanına yazıldıktan ve doğrulandıktan sonra dosyaları sil
async function verifyAndRemoveLocalFiles() {
  await persistState();
  const st = await pool.query("SELECT value FROM app_state WHERE key = 'main';");
  const wc = await pool.query('SELECT COUNT(*)::int AS c FROM words_store;');
  const dbUsers = st.rows[0] ? Object.keys(st.rows[0].value.users || {}).length : 0;
  const okState = dbUsers === Object.keys(appState.users).length && dbUsers > 0;
  const okWords = wc.rows[0].c === wordsStore.length && wordsStore.length > 0;
  if (!okState || !okWords) {
    console.warn('⚠️ Veritabanı doğrulaması başarısız; yerel dosyalar silinmedi.');
    return;
  }
  for (const f of [WORDS_10K_PATH, STATE_PATH, LEGACY_STATE_PATH]) {
    try { if (fs.existsSync(f)) { fs.unlinkSync(f); console.log('🗑️ Yerel dosya silindi:', path.relative(__dirname, f)); } } catch (e) {}
  }
  try { if (fs.existsSync(DATA_DIR)) fs.rmSync(DATA_DIR, { recursive: true, force: true }); } catch (e) {}
}

// ==================== POSTGRESQL (DOCKER) ====================
const pool = new Pool({
  host: process.env.PG_HOST || '127.0.0.1',
  port: parseInt(process.env.PG_PORT || '5433', 10),
  database: process.env.PG_DATABASE || 'lingo_db',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  connectionTimeoutMillis: 2000,
});
pool.on('error', () => { pgAvailable = false; });

let pgAvailable = false;

function pg(query, params) {
  if (!pgAvailable) return Promise.resolve(null);
  return pool.query(query, params).catch(err => {
    console.warn('PG yazma hatası:', err.message);
    if (/ECONNREFUSED|terminat|Connection/i.test(err.message)) pgAvailable = false;
    return null;
  });
}

async function ensurePgUserId(user) {
  if (!pgAvailable) return null;
  const res = await pg(
    `INSERT INTO users (username, password_hash, password_salt, created_at, last_login_at)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash,
       password_salt = EXCLUDED.password_salt, last_login_at = EXCLUDED.last_login_at
     RETURNING id;`,
    [user.username, user.hash, user.salt, user.createdAt, user.lastLoginAt]
  );
  if (res && res.rows[0]) {
    user.pgId = res.rows[0].id;
    return user.pgId;
  }
  return null;
}

async function pgSyncUser(user) {
  const uid = await ensurePgUserId(user);
  if (!uid) return;

  for (const [key, value] of Object.entries(user.settings || {})) {
    await pg(
      `INSERT INTO user_settings (user_id, key, value, updated_at) VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();`,
      [uid, key, String(value ?? '')]
    );
  }

  const wordEntries = Object.entries(user.wordStatuses || {});
  for (let i = 0; i < wordEntries.length; i += 400) {
    const chunk = wordEntries.slice(i, i + 400);
    const values = [];
    const params = [];
    chunk.forEach(([wid, status], idx) => {
      const w = wordsStore.find(x => x.id === Number(wid));
      const o = idx * 4;
      values.push(`($${o + 1}, $${o + 2}, $${o + 3}, $${o + 4}, NOW())`);
      params.push(uid, Number(wid), w ? w.word : null, status);
    });
    if (values.length) {
      await pg(
        `INSERT INTO user_word_status (user_id, word_id, word, status, updated_at) VALUES ${values.join(', ')}
         ON CONFLICT (user_id, word_id) DO UPDATE SET status = EXCLUDED.status, updated_at = NOW();`,
        params
      );
    }
  }

  for (const [nodeId, sc] of Object.entries(user.grammarProgress.nodeScores || {})) {
    await pgWriteGrammarProgress(user, nodeId, sc);
  }

  for (const [achId, unlockedAt] of Object.entries(user.achievements || {})) {
    await pgWriteAchievement(user, achId, unlockedAt);
  }
}

async function pgWriteGrammarProgress(user, nodeId, sc) {
  const uid = user.pgId || await ensurePgUserId(user);
  if (!uid) return;
  await pg(
    `INSERT INTO user_grammar_progress (user_id, node_id, passed, best_score, lesson_score, attempts, payload, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
     ON CONFLICT (user_id, node_id) DO UPDATE SET passed = EXCLUDED.passed, best_score = EXCLUDED.best_score,
       lesson_score = EXCLUDED.lesson_score, attempts = EXCLUDED.attempts, payload = EXCLUDED.payload, updated_at = NOW();`,
    [uid, nodeId, Boolean(sc.passed), sc.bestExamScore || 0, sc.lessonScore ?? null, sc.attempts || 0, JSON.stringify(sc)]
  );
}

async function pgWriteAchievement(user, achId, unlockedAt) {
  const uid = user.pgId || await ensurePgUserId(user);
  if (!uid) return;
  const def = ACHIEVEMENTS.find(a => a.id === achId);
  await pg(
    `INSERT INTO user_achievements (user_id, achievement_id, title, unlocked_at) VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, achievement_id) DO NOTHING;`,
    [uid, achId, def ? def.title : achId, unlockedAt]
  );
}

async function createTables() {
  {
    await pool.query('SELECT 1;');
    pgAvailable = true;
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_login_at TIMESTAMP WITH TIME ZONE
      );
      CREATE TABLE IF NOT EXISTS user_settings (
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        key VARCHAR(100) NOT NULL,
        value TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (user_id, key)
      );
      CREATE TABLE IF NOT EXISTS user_word_status (
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        word_id INT NOT NULL,
        word VARCHAR(120),
        status VARCHAR(20) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (user_id, word_id)
      );
      CREATE TABLE IF NOT EXISTS user_grammar_progress (
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        node_id VARCHAR(50) NOT NULL,
        passed BOOLEAN DEFAULT FALSE,
        best_score INT DEFAULT 0,
        lesson_score INT,
        attempts INT DEFAULT 0,
        payload JSONB,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (user_id, node_id)
      );
      CREATE TABLE IF NOT EXISTS user_achievements (
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        achievement_id VARCHAR(50) NOT NULL,
        title VARCHAR(120),
        unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (user_id, achievement_id)
      );
      CREATE TABLE IF NOT EXISTS grammar_generated_contents (
        id SERIAL PRIMARY KEY,
        topic_id VARCHAR(50) NOT NULL,
        section_type VARCHAR(50) NOT NULL,
        payload JSONB NOT NULL,
        created_by INT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      ALTER TABLE grammar_generated_contents ADD COLUMN IF NOT EXISTS created_by INT REFERENCES users(id) ON DELETE SET NULL;

      CREATE TABLE IF NOT EXISTS grammar_question_bank (
        id VARCHAR(120) PRIMARY KEY,
        node_id VARCHAR(50) NOT NULL,
        kind VARCHAR(30) NOT NULL,
        sub_skill_tag VARCHAR(60),
        payload JSONB NOT NULL,
        created_by INT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS quiz_question_bank (
        id SERIAL PRIMARY KEY,
        word_id INT NOT NULL,
        word VARCHAR(120) NOT NULL,
        sentence TEXT NOT NULL,
        sentence_tr TEXT,
        hint TEXT,
        source VARCHAR(20) DEFAULT 'gemini',
        created_by INT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (word_id, sentence)
      );

      CREATE TABLE IF NOT EXISTS app_state (
        key VARCHAR(40) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS words_store (
        id INT PRIMARY KEY,
        ord BIGINT NOT NULL,
        data JSONB NOT NULL
      );

      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        room_id VARCHAR(64) NOT NULL,
        sender VARCHAR(50) NOT NULL,
        sender_badge VARCHAR(60),
        original_text TEXT NOT NULL,
        corrected_text TEXT,
        translation_tr TEXT,
        mistakes JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_chat_room_id ON chat_messages(room_id);
      CREATE INDEX IF NOT EXISTS idx_gqb_node_id ON grammar_question_bank(node_id);
      CREATE INDEX IF NOT EXISTS idx_user_word_status_user_status ON user_word_status(user_id, status);
      CREATE INDEX IF NOT EXISTS idx_quiz_qb_word_id ON quiz_question_bank(word_id);
    `);

  }
}

// Yerel quiz / gramer havuzu kayıtlarını ilgili tablolara aktar
async function migrateBanksToTables() {
  for (const q of appState.quizBank || []) {
    if (!q || !q.wordId || !q.sentence) continue;
    await pool.query(
      `INSERT INTO quiz_question_bank (word_id, word, sentence, sentence_tr, hint, source)
       VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (word_id, sentence) DO NOTHING;`,
      [q.wordId, q.word || '', q.sentence, q.sentenceTr || '', q.hint || '', q.source || 'gemini']
    );
  }
  for (const [nodeId, list] of Object.entries(appState.grammarQuestionBank || {})) {
    for (const q of list || []) {
      if (!q || !q.id) continue;
      await pool.query(
        `INSERT INTO grammar_question_bank (id, node_id, kind, sub_skill_tag, payload)
         VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING;`,
        [q.id, nodeId, q.kind || 'fill', q.subSkillTag || 'general', JSON.stringify(q)]
      );
    }
  }
}

async function bootstrap() {
  // PostgreSQL (Docker) hazır olana kadar bekle; sunucu verisiz başlamaz
  for (;;) {
    try {
      await createTables();
      break;
    } catch (e) {
      pgAvailable = false;
      console.log('⏳ Docker PostgreSQL bekleniyor (lingo_db:5433)...');
      await sleep(3000);
    }
  }

  await loadWordsFromDb();
  await loadStateFromDb();
  await migrateBanksToTables();
  for (const user of Object.values(appState.users)) {
    await pgSyncUser(user);
  }
  await verifyAndRemoveLocalFiles();
  console.log(`✅ PostgreSQL (lingo_db:5433) bağlı — ${Object.keys(appState.users).length} kullanıcı yüklendi.`);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Lingo API http://localhost:${PORT} üzerinde çalışıyor (${wordsStore.length} kelime, tüm veri PostgreSQL'de).`);
  });

  // Bağlantı koparsa yeniden bağlanıp durumu geri yaz
  setInterval(async () => {
    if (pgAvailable) return;
    try {
      await createTables();
      await persistState();
      console.log('✅ PostgreSQL bağlantısı geri geldi.');
    } catch (e) {
      pgAvailable = false;
    }
  }, 10000);
}
bootstrap();

// ==================== YARDIMCILAR ====================
function publicUser(user) {
  return {
    id: user.pgId || null,
    username: user.username,
    createdAt: user.createdAt,
    settings: user.settings,
  };
}

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const session = token ? appState.sessions[token] : null;
  const user = session ? appState.users[session.username] : null;
  if (!user) return res.status(401).json({ error: 'Oturum geçersiz. Lütfen tekrar giriş yapın.' });
  req.user = user;
  req.token = token;
  next();
}

function statusOf(user, wordId) {
  return user.wordStatuses[wordId] || 'unseen';
}

function withStatus(user, w) {
  return { ...w, status: statusOf(user, w.id) };
}

function computeUserStats(user) {
  const counts = { unseen: 0, waiting: 0, known: 0, mastered: 0 };
  for (const st of Object.values(user.wordStatuses)) {
    if (counts[st] !== undefined) counts[st]++;
  }
  const scores = Object.entries(user.grammarProgress.nodeScores || {});
  return {
    touched: Object.keys(user.wordStatuses).length,
    learned: counts.known + counts.mastered,
    waiting: counts.waiting,
    lessonsDone: scores.filter(([, s]) => typeof s.lessonScore === 'number').length,
    passedTopics: scores.filter(([id, s]) => s.passed && !id.includes('-cp')).length,
    passedCheckpoints: scores.filter(([id, s]) => s.passed && id.includes('-cp')).length,
    maxScore: scores.reduce((m, [, s]) => Math.max(m, s.bestExamScore || 0), 0),
    completed: user.grammarProgress.completedNodeIds || [],
  };
}

function evaluateAchievements(user) {
  const stats = computeUserStats(user);
  const unlockedNow = [];
  for (const a of ACHIEVEMENTS) {
    if (!user.achievements[a.id] && a.check(stats)) {
      const at = new Date().toISOString();
      user.achievements[a.id] = at;
      unlockedNow.push({ id: a.id, title: a.title, desc: a.desc, icon: a.icon, unlockedAt: at });
      pgWriteAchievement(user, a.id, at);
    }
  }
  return unlockedNow;
}

// ==================== AUTH ====================
app.post('/api/auth/register', async (req, res) => {
  const username = String(req.body.username || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (!/^[a-z0-9_]{3,32}$/.test(username)) {
    return res.status(400).json({ error: 'Kullanıcı adı 3-32 karakter olmalı (harf, rakam, _).' });
  }
  if (password.length < 4) {
    return res.status(400).json({ error: 'Şifre en az 4 karakter olmalı.' });
  }
  if (appState.users[username]) {
    return res.status(409).json({ error: 'Bu kullanıcı adı zaten alınmış.' });
  }

  const user = newUserRecord(username, password);
  user.settings = { api_url: ADMIN_DEFAULTS.api_url, api_url_mobile: ADMIN_DEFAULTS.api_url_mobile };
  user.lastLoginAt = new Date().toISOString();
  appState.users[username] = user;

  const token = crypto.randomBytes(32).toString('hex');
  appState.sessions[token] = { username, createdAt: new Date().toISOString() };
  saveLocalState();
  await pgSyncUser(user);
  saveLocalState();

  res.json({ token, user: publicUser(user) });
});

app.post('/api/auth/login', async (req, res) => {
  const username = String(req.body.username || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const user = appState.users[username];
  if (!user || !verifyPassword(password, user.salt, user.hash)) {
    return res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı.' });
  }

  user.lastLoginAt = new Date().toISOString();
  const token = crypto.randomBytes(32).toString('hex');
  appState.sessions[token] = { username, createdAt: new Date().toISOString() };
  saveLocalState();
  ensurePgUserId(user).then(saveLocalState);

  res.json({ token, user: publicUser(user) });
});

app.post('/api/auth/logout', auth, (req, res) => {
  delete appState.sessions[req.token];
  saveLocalState();
  res.json({ success: true });
});

app.get('/api/auth/me', auth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

// ==================== GENEL ====================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    totalWords: wordsStore.length,
    database: pgAvailable ? 'PostgreSQL (Docker lingo_db) + yerel yedek' : 'Yerel depolama (PostgreSQL kapalı)',
    postgres: pgAvailable,
    users: Object.keys(appState.users).length,
  });
});

// ==================== BAŞARIMLAR ====================
app.get('/api/me/achievements', auth, (req, res) => {
  const newly = evaluateAchievements(req.user);
  if (newly.length) saveLocalState();
  res.json({
    achievements: ACHIEVEMENTS.map(a => ({
      id: a.id,
      title: a.title,
      desc: a.desc,
      icon: a.icon,
      unlocked: Boolean(req.user.achievements[a.id]),
      unlockedAt: req.user.achievements[a.id] || null,
    })),
    stats: computeUserStats(req.user),
  });
});

// ==================== KELİMELER ====================
app.get('/api/stats', auth, (req, res) => {
  const user = req.user;
  let waitingCount = 0;
  let knownCount = 0;
  let masteredCount = 0;

  const statuses = user.wordStatuses || {};
  for (const s of Object.values(statuses)) {
    if (s === 'waiting') waitingCount++;
    else if (s === 'known') knownCount++;
    else if (s === 'mastered') masteredCount++;
  }
  const unseenCount = Math.max(0, wordsStore.length - (waitingCount + knownCount + masteredCount));

  res.json({
    totalCount: wordsStore.length,
    unseenCount,
    waitingCount,
    knownCount,
    masteredCount,
    levelCounts: staticLevelCounts,
  });
});

app.get('/api/words', auth, (req, res) => {
  const user = req.user;
  const { level, status = 'unseen', limit = 50, offset = 0, search } = req.query;
  const searchLower = search ? String(search).toLowerCase() : '';
  const limitNum = limit === 'ALL' ? 12000 : parseInt(String(limit), 10) || 50;
  const offsetNum = parseInt(String(offset), 10) || 0;

  // Optimize: Eğer kullanıcı 'waiting', 'mastered' veya 'known' istiyorsa 10.000 kelimeyi tarama;
  // doğrudan kullanıcının kendi kayıtlarından O(1) çek.
  if (status === 'waiting' || status === 'mastered' || status === 'known') {
    const statuses = user.wordStatuses || {};
    const matched = [];
    for (const [idStr, st] of Object.entries(statuses)) {
      if (st === status) {
        const w = wordsById.get(Number(idStr));
        if (w) {
          if (level && level !== 'ALL' && w.level !== level) continue;
          if (searchLower) {
            const matchWord = w.word.toLowerCase().includes(searchLower);
            const matchTr = (w.translation || '').toLowerCase().includes(searchLower);
            if (!matchWord && !matchTr) continue;
          }
          matched.push(w);
        }
      }
    }
    const sliced = matched.slice(offsetNum, offsetNum + limitNum).map(w => withStatus(user, w));
    return res.json({ total: matched.length, count: sliced.length, limit: limitNum, offset: offsetNum, words: sliced });
  }

  // Seviye filtresi varsa sadece o seviyenin havuzunu tara
  const candidatePool = (level && level !== 'ALL' && wordsByLevel[level]) ? wordsByLevel[level] : wordsStore;
  const filtered = [];
  for (let i = 0; i < candidatePool.length; i++) {
    const w = candidatePool[i];
    if (status && status !== 'ALL' && statusOf(user, w.id) !== status) continue;
    if (searchLower) {
      const matchWord = w.word.toLowerCase().includes(searchLower);
      const matchTr = (w.translation || '').toLowerCase().includes(searchLower);
      if (!matchWord && !matchTr) continue;
    }
    filtered.push(w);
  }

  const sliced = filtered.slice(offsetNum, offsetNum + limitNum).map(w => withStatus(user, w));
  res.json({ total: filtered.length, count: sliced.length, limit: limitNum, offset: offsetNum, words: sliced });
});

app.get('/api/waiting', auth, (req, res) => {
  const statuses = req.user.wordStatuses || {};
  const waiting = [];
  for (const [idStr, st] of Object.entries(statuses)) {
    if (st === 'waiting') {
      const w = wordsById.get(Number(idStr));
      if (w) waiting.push(withStatus(req.user, w));
    }
  }
  res.json({ count: waiting.length, words: waiting });
});

app.post('/api/words/:id/status', auth, async (req, res) => {
  const user = req.user;
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;

  if (!['unseen', 'known', 'waiting', 'mastered'].includes(status)) {
    return res.status(400).json({ error: 'Geçersiz durum: ' + status });
  }
  const word = wordsById.get(id);
  if (!word) return res.status(404).json({ error: 'Kelime bulunamadı' });

  if (status === 'unseen') delete user.wordStatuses[id];
  else user.wordStatuses[id] = status;

  const newAchievements = evaluateAchievements(user);
  saveLocalState();

  const uid = user.pgId || await ensurePgUserId(user);
  if (uid) {
    if (status === 'unseen') {
      pg('DELETE FROM user_word_status WHERE user_id = $1 AND word_id = $2;', [uid, id]);
    } else {
      pg(
        `INSERT INTO user_word_status (user_id, word_id, word, status, updated_at) VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (user_id, word_id) DO UPDATE SET status = EXCLUDED.status, updated_at = NOW();`,
        [uid, id, word.word, status]
      );
    }
  }

  res.json({ success: true, word: withStatus(user, word), newAchievements });
});

app.post('/api/words/add-batch', auth, (req, res) => {
  const { words } = req.body;
  if (!Array.isArray(words) || words.length === 0) {
    return res.status(400).json({ error: 'Eklenecek kelime dizisi gerekli' });
  }

  const existingSet = new Set(wordsStore.map(w => w.word.toLowerCase()));
  let nextId = wordsStore.reduce((m, w) => Math.max(m, w.id), 0) + 1;
  const added = [];

  for (const item of words) {
    if (!item.word || !item.translation) continue;
    const key = String(item.word).trim().toLowerCase();
    if (existingSet.has(key)) continue;
    existingSet.add(key);

    const newWord = {
      id: nextId++,
      word: String(item.word).trim(),
      phonetic: item.phonetic || `/${key}/`,
      translation: String(item.translation).trim(),
      partOfSpeech: item.partOfSpeech || 'noun',
      level: item.level || 'B2',
      sampleEn: item.sampleEn || '',
      sampleTr: item.sampleTr || '',
      mnemonicHint: item.mnemonicHint || '',
      imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    };
    wordsStore.unshift(newWord);
    wordsById.set(newWord.id, newWord);
    if (newWord.level && wordsByLevel[newWord.level]) {
      wordsByLevel[newWord.level].unshift(newWord);
      staticLevelCounts[newWord.level] = (staticLevelCounts[newWord.level] || 0) + 1;
    }
    added.push(newWord);

    pg(
      `INSERT INTO words (word, phonetic, translation, part_of_speech, level, sample_en, sample_tr, mnemonic_hint, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (word) DO NOTHING;`,
      [newWord.word, newWord.phonetic, newWord.translation, newWord.partOfSpeech, newWord.level,
        newWord.sampleEn, newWord.sampleTr, newWord.mnemonicHint, newWord.imageUrl]
    );
  }

  if (added.length > 0) saveWordsStore(added, true);
  res.json({ success: true, addedCount: added.length, totalWords: wordsStore.length, added });
});

// ==================== GRAMER ====================
app.get('/api/grammar/state', auth, (req, res) => {
  res.json({
    progress: req.user.grammarProgress,
    customContents: appState.grammarCustomContents,
  });
});

app.post('/api/grammar/topic/:topicId/save-content', auth, (req, res) => {
  const { topicId } = req.params;
  const { drills, examQuestions, examples, deepRules, listening, reading, writing, lessonSteps } = req.body;

  if (!appState.grammarCustomContents[topicId]) {
    appState.grammarCustomContents[topicId] = {
      drills: [], examQuestions: [], examples: [], deepRules: [],
      listening: null, reading: null, writing: [], lessonSteps: [],
    };
  }
  const bucket = appState.grammarCustomContents[topicId];
  bucket.lessonSteps = bucket.lessonSteps || [];

  const mergeBy = (target, items, key) => {
    const seen = new Set(target.map(x => x[key]));
    for (const it of items) if (it && !seen.has(it[key])) { target.push(it); seen.add(it[key]); }
  };

  if (Array.isArray(drills)) mergeBy(bucket.drills, drills, 'sentence');
  if (Array.isArray(examQuestions)) mergeBy(bucket.examQuestions, examQuestions, 'sentence');
  if (Array.isArray(examples)) mergeBy(bucket.examples, examples, 'en');
  if (Array.isArray(deepRules)) mergeBy(bucket.deepRules, deepRules, 'title');
  if (Array.isArray(writing)) mergeBy(bucket.writing, writing, 'promptTr');
  if (Array.isArray(lessonSteps) && lessonSteps.length > 0) bucket.lessonSteps = lessonSteps;
  if (listening && listening.audioScript) bucket.listening = listening;
  if (reading && reading.passage) bucket.reading = reading;

  saveLocalState();

  pg(
    'INSERT INTO grammar_generated_contents (topic_id, section_type, payload, created_by) VALUES ($1, $2, $3, $4);',
    [topicId, lessonSteps ? 'lesson_steps' : 'gemini_enrichment', JSON.stringify(req.body), req.user.pgId]
  );

  res.json({ success: true, topicId, storedContent: bucket });
});

app.post('/api/grammar/progress', auth, async (req, res) => {
  const user = req.user;
  const { nodeId, examScore, sectionType, sectionScore } = req.body;
  if (!nodeId) return res.status(400).json({ error: 'nodeId gerekli' });

  const prev = user.grammarProgress.nodeScores[nodeId] || { bestExamScore: 0, attempts: 0, passed: false };
  const isExam = typeof examScore === 'number';
  const newBest = isExam ? Math.max(prev.bestExamScore || 0, examScore) : prev.bestExamScore || 0;
  const passed = Boolean(prev.passed || newBest >= 80);

  const updated = {
    ...prev,
    bestExamScore: newBest,
    attempts: (prev.attempts || 0) + (isExam ? 1 : 0),
    passed,
    updatedAt: new Date().toISOString(),
  };
  if (sectionType && typeof sectionScore === 'number') {
    updated[`${sectionType}Score`] = Math.max(prev[`${sectionType}Score`] || 0, sectionScore);
  }

  user.grammarProgress.nodeScores[nodeId] = updated;
  if (passed && !user.grammarProgress.completedNodeIds.includes(nodeId)) {
    user.grammarProgress.completedNodeIds.push(nodeId);
  }

  appState.grammarAttemptsLog.push({
    username: user.username, nodeId, examScore, sectionType, sectionScore, passed, timestamp: new Date().toISOString(),
  });
  if (appState.grammarAttemptsLog.length > 2000) appState.grammarAttemptsLog.splice(0, 500);

  const newAchievements = evaluateAchievements(user);
  saveLocalState();
  pgWriteGrammarProgress(user, nodeId, updated);

  res.json({ success: true, progress: user.grammarProgress, newAchievements });
});

// ==================== AYARLAR (KULLANICIYA ÖZEL) ====================
app.get('/api/settings', auth, (req, res) => {
  res.json(req.user.settings);
});

app.post('/api/settings', auth, async (req, res) => {
  const { key, value } = req.body;
  if (!key) return res.status(400).json({ error: 'Ayar anahtarı (key) gereklidir' });
  req.user.settings[key] = value;
  saveLocalState();

  const uid = req.user.pgId || await ensurePgUserId(req.user);
  if (uid) {
    pg(
      `INSERT INTO user_settings (user_id, key, value, updated_at) VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();`,
      [uid, key, String(value ?? '')]
    );
  }
  res.json({ success: true, key, value });
});

app.post('/api/reset', auth, async (req, res) => {
  const user = req.user;
  user.wordStatuses = {};
  user.grammarProgress = { completedNodeIds: [], nodeScores: {} };
  saveLocalState();

  if (user.pgId) {
    pg('DELETE FROM user_word_status WHERE user_id = $1;', [user.pgId]);
    pg('DELETE FROM user_grammar_progress WHERE user_id = $1;', [user.pgId]);
  }
  res.json({ success: true, message: 'Kelime ve gramer ilerlemen sıfırlandı (başarımlar korunur).' });
});

// ==================== ARENA CÜMLE / SORU HAVUZU (POSTGRESQL) ====================
app.get('/api/quiz/bank', auth, async (req, res) => {
  const wordId = parseInt(String(req.query.wordId || ''), 10);
  if (!wordId) return res.status(400).json({ error: 'wordId gerekli' });

  const local = (appState.quizBank || []).filter(q => q.wordId === wordId);
  let rows = [];
  if (pgAvailable) {
    const r = await pg(
      'SELECT word_id, word, sentence, sentence_tr, hint, source FROM quiz_question_bank WHERE word_id = $1 ORDER BY created_at DESC LIMIT 50;',
      [wordId]
    );
    if (r && r.rows) {
      rows = r.rows.map(x => ({
        wordId: x.word_id,
        word: x.word,
        sentence: x.sentence,
        sentenceTr: x.sentence_tr,
        hint: x.hint,
        source: x.source,
      }));
    }
  }
  const seen = new Set();
  const merged = [];
  for (const q of [...rows, ...local]) {
    if (q && q.sentence && !seen.has(q.sentence)) {
      seen.add(q.sentence);
      merged.push(q);
    }
  }
  res.json({ wordId, count: merged.length, questions: merged });
});

app.post('/api/quiz/bank/save', auth, async (req, res) => {
  const { wordId, word, sentence, sentenceTr = '', hint = '', source = 'gemini' } = req.body || {};
  if (!wordId || !word || !sentence) {
    return res.status(400).json({ error: 'wordId, word ve sentence gerekli' });
  }

  if (!appState.quizBank) appState.quizBank = [];
  const exists = appState.quizBank.some(q => q.wordId === wordId && q.sentence === sentence);
  if (!exists) {
    appState.quizBank.unshift({ wordId, word, sentence, sentenceTr, hint, source });
    if (appState.quizBank.length > 5000) appState.quizBank.length = 5000;
    saveLocalState();
  }

  if (pgAvailable) {
    await pg(
      `INSERT INTO quiz_question_bank (word_id, word, sentence, sentence_tr, hint, source, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (word_id, sentence) DO NOTHING;`,
      [wordId, word, sentence, sentenceTr, hint, source, req.user.pgId || null]
    );
  }
  res.json({ success: true, duplicate: exists });
});

app.get('/api/quiz/bank/stats', auth, async (req, res) => {
  let total = (appState.quizBank || []).length;
  if (pgAvailable) {
    const r = await pg('SELECT COUNT(*)::int AS c FROM quiz_question_bank;');
    if (r && r.rows && r.rows[0]) total = Math.max(total, r.rows[0].c);
  }
  res.json({ total });
});

// ==================== GRAMER SORU BANKASI & DERİN KURAL KAYDI (POSTGRESQL) ====================
app.get('/api/grammar/pool/:nodeId', auth, async (req, res) => {
  const { nodeId } = req.params;
  const localQuestions = (appState.grammarQuestionBank && appState.grammarQuestionBank[nodeId]) || [];
  let dbQuestions = [];

  if (pgAvailable) {
    const r = await pg(
      'SELECT payload FROM grammar_question_bank WHERE node_id = $1 ORDER BY created_at DESC LIMIT 300;',
      [nodeId]
    );
    if (r && r.rows) {
      dbQuestions = r.rows.map(row => row.payload);
    }
  }

  const seenIds = new Set();
  const merged = [];
  for (const q of [...dbQuestions, ...localQuestions]) {
    if (q && q.id && !seenIds.has(q.id)) {
      seenIds.add(q.id);
      merged.push(q);
    }
  }

  const customRuleBlocks =
    (appState.grammarCustomContents[nodeId] && appState.grammarCustomContents[nodeId].deepRuleBlocks) || [];

  res.json({
    nodeId,
    count: merged.length,
    questions: merged,
    customRuleBlocks,
  });
});

app.post('/api/grammar/pool/:nodeId/save', auth, async (req, res) => {
  const { nodeId } = req.params;
  const { questions = [], deepRuleBlocks = [] } = req.body;

  if (!appState.grammarQuestionBank) appState.grammarQuestionBank = {};
  if (!appState.grammarQuestionBank[nodeId]) appState.grammarQuestionBank[nodeId] = [];

  const bucket = appState.grammarQuestionBank[nodeId];
  const seenIds = new Set(bucket.map(q => q.id));
  let savedCount = 0;

  for (const q of questions) {
    if (!q || !q.id) continue;
    if (!seenIds.has(q.id)) {
      bucket.unshift(q);
      seenIds.add(q.id);
      savedCount++;
    }
    if (pgAvailable) {
      await pg(
        `INSERT INTO grammar_question_bank (id, node_id, kind, sub_skill_tag, payload, created_by, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload;`,
        [q.id, nodeId, q.kind || 'fill', q.subSkillTag || 'general', JSON.stringify(q), req.user.pgId || null]
      );
    }
  }

  if (Array.isArray(deepRuleBlocks) && deepRuleBlocks.length > 0) {
    if (!appState.grammarCustomContents[nodeId]) {
      appState.grammarCustomContents[nodeId] = {
        drills: [], examQuestions: [], examples: [], deepRules: [],
        listening: null, reading: null, writing: [], lessonSteps: [], deepRuleBlocks: [],
      };
    }
    const existingBlocks = appState.grammarCustomContents[nodeId].deepRuleBlocks || [];
    const seenTitles = new Set(existingBlocks.map(b => b.title));
    for (const blk of deepRuleBlocks) {
      if (blk && blk.title && !seenTitles.has(blk.title)) {
        existingBlocks.push(blk);
        seenTitles.add(blk.title);
      }
    }
    appState.grammarCustomContents[nodeId].deepRuleBlocks = existingBlocks;

    if (pgAvailable) {
      await pg(
        'INSERT INTO grammar_generated_contents (topic_id, section_type, payload, created_by) VALUES ($1, $2, $3, $4);',
        [nodeId, 'deep_research_rules', JSON.stringify({ deepRuleBlocks }), req.user.pgId || null]
      );
    }
  }

  saveLocalState();
  res.json({
    success: true,
    nodeId,
    savedCount,
    totalInPool: bucket.length,
  });
});

// ==================== CANLI MESAJLAŞMA & GRAMER / ÇEVİRİ DENETLEYİCİ ====================
const INITIAL_CHAT_ROOMS = [
  {
    id: 'ai-partner',
    title: '🤖 Lingo AI (Canlı Gemini Konuşma Partneri)',
    subtitle: 'Gemini LLM ile dilediğin konuda sohbet et, soru sor, anında konuş & pratik yap',
    badge: 'CANLI LLM',
    participants: 2,
  },
  {
    id: 'global-en',
    title: '🌍 Küresel İngilizce Meydanı',
    subtitle: 'Tüm kullanıcılarla canlı İngilizce mesajlaşma ve anında gramer kontrolü',
    badge: 'CANLI ODA',
    participants: 14,
  },
  {
    id: 'partner-emma',
    title: '🇬🇧 Emma (Londra • C1 Partner)',
    subtitle: 'Günlük diyalog, tanışma ve akıcı konuşma pratiği arkadaşı',
    badge: 'AKTİF PARTNER',
    participants: 2,
  },
  {
    id: 'partner-liam',
    title: '🎓 Prof. Liam (Oxford Akademik)',
    subtitle: 'Akademik yazışma, iş İngilizcesi ve ileri gramer geri bildirimi',
    badge: 'AKADEMİK KOÇ',
    participants: 2,
  },
];

function ensureDefaultRoomMessages(roomId) {
  if (!appState.chatMessages) appState.chatMessages = {};
  if (!appState.chatMessages[roomId] || appState.chatMessages[roomId].length === 0) {
    if (roomId === 'ai-partner') {
      appState.chatMessages[roomId] = [
        {
          id: 301,
          roomId: 'ai-partner',
          sender: 'Lingo AI',
          senderBadge: '🤖 Gemini LLM • Canlı',
          originalText:
            "Hello there! I am Lingo AI, your personal English conversational partner. You can chat with me about anything—your daily life, travel, movies, job interview practice, or ask any English grammar question. What would you like to talk about today?",
          correctedText: "Hello there! I am Lingo AI, your personal English conversational partner.",
          translationTr:
            "Merhaba! Ben Lingo AI, kişisel İngilizce konuşma partnerin. Benimle her konuda sohbet edebilirsin—günlük yaşamın, seyahat, filmler, iş mülakatı pratiği veya aklına takılan herhangi bir gramer sorusu. Bugün ne hakkında konuşmak istersin?",
          mistakes: [],
          createdAt: new Date().toISOString(),
        },
      ];
    } else if (roomId === 'global-en') {
      appState.chatMessages[roomId] = [
        {
          id: 1,
          roomId: 'global-en',
          sender: 'Emma',
          senderBadge: '🇬🇧 Londra • C1',
          originalText: 'Hello everyone! Welcome to the live English practice lounge. What is your name and what are you studying today?',
          correctedText: 'Hello everyone! Welcome to the live English practice lounge. What is your name and what are you studying today?',
          translationTr: 'Herkese merhaba! Canlı İngilizce pratik salonuna hoş geldiniz. Adınız ne ve bugün ne çalışıyorsunuz?',
          mistakes: [],
          createdAt: new Date(Date.now() - 360000).toISOString(),
        },
        {
          id: 2,
          roomId: 'global-en',
          sender: 'Kerem_B2',
          senderBadge: '🇹🇷 Üye • B2',
          originalText: 'Hi Emma! I am practicing Simple Present and vocabulary today. How is the weather in London?',
          correctedText: 'Hi Emma! I am practicing Simple Present and vocabulary today. How is the weather in London?',
          translationTr: 'Selam Emma! Bugün Geniş Zaman ve kelime pratiği yapıyorum. Londra’da hava nasıl?',
          mistakes: [],
          createdAt: new Date(Date.now() - 180000).toISOString(),
        },
      ];
    } else if (roomId === 'partner-emma') {
      appState.chatMessages[roomId] = [
        {
          id: 101,
          roomId: 'partner-emma',
          sender: 'Emma',
          senderBadge: '🇬🇧 Londra • C1',
          originalText: 'Hey there! Nice to meet you. Tell me a bit about yourself! (Tip: Try writing "hello ı are omer" to see how the Grammar Inspector fixes your sentence!)',
          correctedText: 'Hey there! Nice to meet you. Tell me a bit about yourself!',
          translationTr: 'Selam! Tanıştığımıza memnun oldum. Bana biraz kendinden bahset! (İpucu: Gramer Denetleyicinin cümleni nasıl düzelttiğini görmek için "hello ı are omer" yazmayı dene!)',
          mistakes: [],
          createdAt: new Date(Date.now() - 120000).toISOString(),
        },
      ];
    } else {
      appState.chatMessages[roomId] = [
        {
          id: 201,
          roomId,
          sender: 'Prof. Liam',
          senderBadge: '🎓 Oxford • C2',
          originalText: 'Greetings! Write any English or Turkish sentence below. I will analyze your grammar, word choices, and help you communicate accurately.',
          correctedText: 'Greetings! Write any English or Turkish sentence below.',
          translationTr: 'Selamlar! Aşağıya herhangi bir İngilizce veya Türkçe cümle yazın. Gramerinizi, kelime seçimlerinizi analiz edeceğim ve doğru iletişim kurmanıza yardımcı olacağım.',
          mistakes: [],
          createdAt: new Date(Date.now() - 90000).toISOString(),
        },
      ];
    }
  }
  return appState.chatMessages[roomId];
}

// Yerel Deterministik Gramer, Kelime ve Çeviri Denetleyicisi (Anında & Çevrimdışı/Yedek Destekli)
function localInspectMessage(rawInput) {
  const original = String(rawInput || '').trim();
  if (!original) {
    return {
      originalText: '',
      hasErrors: false,
      correctedEn: '',
      naturalAlternativeEn: '',
      translationTr: '',
      mistakes: [],
      wordBreakdown: [],
    };
  }

  const mistakes = [];
  let working = original;

  // 1. Türkçe noktasız 'ı' veya küçük 'i' zamirinin İngilizce 'I' zamirine dönüştürülmesi
  if (/(?:^|\s)[ıi](?=\s+(?:am|are|is|was|were|have|has|had|will|would|can|could|want|need|like|work|live|go|think|know|dont|don't|m\b))/i.test(working) || /(?:^|\s)ı(?=\s|$)/i.test(working)) {
    const before = working;
    working = working.replace(/(^|\s)[ıi](?=\s|$)/g, '$1I');
    if (working !== before) {
      mistakes.push({
        wrong: 'ı / i',
        right: 'I',
        ruleTitle: 'İngilizce "I" (Ben) Zamiri Büyük Harf Kuralı',
        explanationTr:
          'İngilizcede "ben" anlamına gelen "I" zamiri cümlenin neresinde olursa olsun her zaman büyük "I" harfiyle yazılır; Türkçe noktasız "ı" veya küçük "i" kullanılmaz.',
      });
    }
  }

  // 2. "I are" / "I is" -> "I am" hatası (Örn: "hello ı are omer")
  if (/\bI\s+are\b/i.test(working)) {
    working = working.replace(/\bI\s+are\b/gi, 'I am');
    mistakes.push({
      wrong: 'I are',
      right: 'I am',
      ruleTitle: 'Özne - Yardımcı Fiil Uyumu (To Be)',
      explanationTr:
        '"I" (Ben) öznesi geniş zamanda "are" (çoğul/sen) yardımcı fiilini alamaz. "I" öznesiyle her zaman "am" kullanılır ("I am ...").',
    });
  }
  if (/\bI\s+is\b/i.test(working)) {
    working = working.replace(/\bI\s+is\b/gi, 'I am');
    mistakes.push({
      wrong: 'I is',
      right: 'I am',
      ruleTitle: 'Özne - Yardımcı Fiil Uyumu (To Be)',
      explanationTr: '"I" öznesiyle 3. tekil şahıs eki olan "is" değil, "am" kullanılır ("I am").',
    });
  }

  // 3. "He/She/It are" veya "You/We/They is" hataları
  if (/\b(he|she|it)\s+are\b/i.test(working)) {
    working = working.replace(/\b(he|she|it)\s+are\b/gi, (_, p1) => `${p1} is`);
    mistakes.push({
      wrong: 'He/She/It are',
      right: 'He/She/It is',
      ruleTitle: '3. Tekil Şahıs "To Be" Çekimi',
      explanationTr: 'Tekil öznelerle (he, she, it) çoğul olan "are" değil, "is" kullanılır.',
    });
  }
  if (/\b(you|we|they)\s+is\b/i.test(working)) {
    working = working.replace(/\b(you|we|they)\s+is\b/gi, (_, p1) => `${p1} are`);
    mistakes.push({
      wrong: 'You/We/They is',
      right: 'You/We/They are',
      ruleTitle: 'Çoğul Özne "To Be" Çekimi',
      explanationTr: '"You, we, they" özneleriyle tekil "is" değil, "are" kullanılır.',
    });
  }

  // 4. "I am agree" -> "I agree"
  if (/\b(I\s+am|he\s+is|she\s+is|we\s+are|you\s+are|they\s+are)\s+agree\b/i.test(working)) {
    working = working.replace(/\bI\s+am\s+agree\b/gi, 'I agree');
    working = working.replace(/\b(we|you|they)\s+are\s+agree\b/gi, '$1 agree');
    working = working.replace(/\b(he|she)\s+is\s+agree\b/gi, '$1 agrees');
    mistakes.push({
      wrong: 'am/is/are agree',
      right: 'agree / agrees',
      ruleTitle: 'Durum Fiili (Stative Verb) Kuralı',
      explanationTr: '"Agree" (katılmak) bir sıfat değil, fiildir. Bu nedenle başına "am/is/are" gelmez ("I agree").',
    });
  }

  // 5. "He/She/It don't / dont" -> "doesn't"
  if (/\b(he|she|it)\s+don'?t\b/i.test(working)) {
    working = working.replace(/\b(he|she|it)\s+don'?t\b/gi, "$1 doesn't");
    mistakes.push({
      wrong: "he/she don't",
      right: "he/she doesn't",
      ruleTitle: '3. Tekil Şahıs Olumsuz Yardımcı Fiili',
      explanationTr: 'He, she, it özneleriyle geniş zamanda olumsuz yaparken "don\'t" değil "doesn\'t" kullanılır.',
    });
  }

  // 6. "doesn't + V-s" -> "doesn't + V1"
  const doesntS = working.match(/\bdoesn'?t\s+(works|likes|knows|wants|needs|goes|has|comes|takes|makes)\b/i);
  if (doesntS) {
    const verbMap = {
      works: 'work', likes: 'like', knows: 'know', wants: 'want',
      needs: 'need', goes: 'go', has: 'have', comes: 'come', takes: 'take', makes: 'make',
    };
    const vWrong = doesntS[1].toLowerCase();
    const vRight = verbMap[vWrong] || vWrong.replace(/s$/, '');
    working = working.replace(new RegExp(`\\b(doesn'?t)\\s+${doesntS[1]}\\b`, 'i'), `doesn't ${vRight}`);
    mistakes.push({
      wrong: `doesn't ${doesntS[1]}`,
      right: `doesn't ${vRight}`,
      ruleTitle: '"Doesn\'t" Sonrası Yalın Fiil Kuralı',
      explanationTr: '"Doesn\'t" yardımcı fiili zaten "-s" takısını aldığı için ana fiil yalın (V1) haline döner.',
    });
  }

  // 7. "I goes / I works / I likes" -> "I go / I work / I like"
  const iVerbS = working.match(/\bI\s+(goes|works|likes|wants|needs|speaks|lives|studies)\b/i);
  if (iVerbS) {
    const vMap = {
      goes: 'go', works: 'work', likes: 'like', wants: 'want',
      needs: 'need', speaks: 'speak', lives: 'live', studies: 'study',
    };
    const wv = iVerbS[1].toLowerCase();
    const rv = vMap[wv] || wv.replace(/s$/, '');
    working = working.replace(new RegExp(`\\bI\\s+${iVerbS[1]}\\b`, 'i'), `I ${rv}`);
    mistakes.push({
      wrong: `I ${iVerbS[1]}`,
      right: `I ${rv}`,
      ruleTitle: '1. Tekil Şahıs (I) Fiil Çekimi',
      explanationTr: '"I" öznesiyle geniş zamanda fiile "-s / -es" eklenmez; fiil yalın kullanılır.',
    });
  }

  // 8. "He/She/It work/go/like/live/have" -> "-s"
  const heVerbBare = working.match(/\b(he|she|it)\s+(work|go|like|live|have|want|need|speak)\b/i);
  if (heVerbBare) {
    const sMap = {
      work: 'works', go: 'goes', like: 'likes', live: 'lives',
      have: 'has', want: 'wants', need: 'needs', speak: 'speaks',
    };
    const pron = heVerbBare[1];
    const bare = heVerbBare[2].toLowerCase();
    const fixed = sMap[bare];
    if (fixed) {
      working = working.replace(new RegExp(`\\b${pron}\\s+${heVerbBare[2]}\\b`, 'i'), `${pron} ${fixed}`);
      mistakes.push({
        wrong: `${pron} ${heVerbBare[2]}`,
        right: `${pron} ${fixed}`,
        ruleTitle: '3. Tekil Şahıs (-s / has) Kuralı',
        explanationTr: `"${pron}" öznesiyle geniş zamanda olumlu cümlede fiil "-s" takısı alır (have -> has olur).`,
      });
    }
  }

  // 9. Selamlama sonrası virgül ve özel isim büyük harf düzeltmesi (Örn: "hello I am omer" -> "Hello, I am Omer.")
  if (/^(hello|hi|hey)\s+(?!,)/i.test(working)) {
    working = working.replace(/^(hello|hi|hey)\s+/i, m => `${m.trim().charAt(0).toUpperCase() + m.trim().slice(1).toLowerCase()}, `);
  }
  working = working.replace(/\b(I\s+am|my\s+name\s+is)\s+([a-zçğıöşü]+)/i, (full, prefix, name) => {
    const capName = name.charAt(0).toUpperCase() + name.slice(1);
    if (name !== capName) {
      mistakes.push({
        wrong: name,
        right: capName,
        ruleTitle: 'Özel İsimlerde Büyük Harf Kuralı',
        explanationTr: `Kişi isimleri ("${capName}") İngilizcede her zaman büyük harfle başlar.`,
      });
    }
    return `${prefix} ${capName}`;
  });

  // Cümle başı büyük harf ve son noktalama
  working = working.charAt(0).toUpperCase() + working.slice(1);
  if (!/[.?!]$/.test(working)) {
    working += '.';
  }

  // Kelime kelime sözlük ve Türkçe çeviri tahmini
  const MINI_DICT = {
    hello: { tr: 'Merhaba', pos: 'Ünlem' },
    hi: { tr: 'Selam', pos: 'Ünlem' },
    i: { tr: 'Ben', pos: 'Zamir' },
    am: { tr: '-im / olmak (To Be)', pos: 'Yardımcı Fiil' },
    is: { tr: '-dir / olmak (To Be)', pos: 'Yardımcı Fiil' },
    are: { tr: '-siniz / olmak (To Be)', pos: 'Yardımcı Fiil' },
    my: { tr: 'Benim', pos: 'İyelik Sıfatı' },
    name: { tr: 'İsim / Ad', pos: 'İsim' },
    from: { tr: '-den / -dan', pos: 'Edat' },
    turkey: { tr: 'Türkiye', pos: 'Özel İsim' },
    student: { tr: 'Öğrenci', pos: 'İsim' },
    engineer: { tr: 'Mühendis', pos: 'İsim' },
    work: { tr: 'Çalışmak / İş', pos: 'Fiil/İsim' },
    study: { tr: 'Çalışmak / Okumak', pos: 'Fiil' },
    english: { tr: 'İngilizce', pos: 'İsim' },
    today: { tr: 'Bugün', pos: 'Zarf' },
    how: { tr: 'Nasıl', pos: 'Soru Zarfı' },
    you: { tr: 'Sen / Siz', pos: 'Zamir' },
    good: { tr: 'İyi', pos: 'Sıfat' },
    fine: { tr: 'İyi / Hoş', pos: 'Sıfat' },
    thanks: { tr: 'Teşekkürler', pos: 'İsim' },
  };

  const tokens = working.replace(/[.?!,]/g, '').split(/\s+/).filter(Boolean);
  const wordBreakdown = tokens.slice(0, 8).map(tok => {
    const low = tok.toLowerCase();
    if (MINI_DICT[low]) {
      return { word: tok, tr: MINI_DICT[low].tr, pos: MINI_DICT[low].pos };
    }
    const foundInStore = wordsStore.find(w => w.word.toLowerCase() === low);
    if (foundInStore) {
      return { word: tok, tr: foundInStore.translation, pos: foundInStore.partOfSpeech };
    }
    return { word: tok, tr: tok, pos: 'Kelime / Özel İsim' };
  });

  // Cümlenin tam Türkçe çevirisi (Özel kalıplar + akıllı çeviri)
  let translationTr = 'Cümlenin Türkçe anlamı analiz edildi.';
  const nameMatch = working.match(/^(?:Hello|Hi|Hey),\s*I\s+am\s+([A-Za-zÇĞİÖŞÜçğıöşü]+)\.?$/i);
  if (nameMatch) {
    translationTr = `Merhaba, ben ${nameMatch[1]}.`;
  } else if (/^I\s+am\s+([A-Za-zÇĞİÖŞÜçğıöşü]+)\.?$/i.test(working)) {
    const m = working.match(/^I\s+am\s+([A-Za-zÇĞİÖŞÜçğıöşü]+)\.?$/i);
    translationTr = `Ben ${m[1]}.`;
  } else if (/how are you/i.test(working)) {
    translationTr = 'Nasılsın(ız)?';
  } else {
    translationTr = wordBreakdown.map(w => w.tr).join(' ');
  }

  return {
    originalText: original,
    hasErrors: mistakes.length > 0 || original.trim() !== working.replace(/\.$/, '').trim(),
    correctedEn: working,
    naturalAlternativeEn: nameMatch
      ? `Hi there! My name is ${nameMatch[1]}, nice to meet you!`
      : working,
    translationTr,
    mistakes,
    wordBreakdown,
    isAi: false,
  };
}

app.get('/api/chat/rooms', auth, (req, res) => {
  // Kayıtlı diğer kullanıcıları da DM odası olarak listele
  const userRooms = Object.keys(appState.users)
    .filter(u => u !== req.user.username)
    .map(u => ({
      id: `dm-${ [req.user.username, u].sort().join('-') }`,
      title: `👤 @${u} (Kullanıcı Mesajı)`,
      subtitle: `@${u} ile doğrudan İngilizce mesajlaşma ve gramer kontrolü`,
      badge: 'KULLANICI',
      participants: 2,
    }));

  res.json({
    rooms: [...INITIAL_CHAT_ROOMS, ...userRooms],
  });
});

app.get('/api/chat/messages', auth, async (req, res) => {
  const roomId = String(req.query.roomId || 'global-en');
  const localMsgs = ensureDefaultRoomMessages(roomId);

  if (pgAvailable) {
    const r = await pg(
      'SELECT id, room_id, sender, sender_badge, original_text, corrected_text, translation_tr, mistakes, created_at FROM chat_messages WHERE room_id = $1 ORDER BY created_at ASC LIMIT 100;',
      [roomId]
    );
    if (r && r.rows && r.rows.length > 0) {
      const dbMsgs = r.rows.map(row => ({
        id: row.id,
        roomId: row.room_id,
        sender: row.sender,
        senderBadge: row.sender_badge || 'Üye',
        originalText: row.original_text,
        correctedText: row.corrected_text || row.original_text,
        translationTr: row.translation_tr || '',
        mistakes: row.mistakes || [],
        createdAt: row.created_at,
      }));
      return res.json({ roomId, messages: dbMsgs });
    }
  }

  res.json({ roomId, messages: localMsgs });
});

app.post('/api/chat/inspect', auth, async (req, res) => {
  const { text } = req.body;
  const localResult = localInspectMessage(text);
  const apiKey = req.user.settings?.gemini_api_key || ADMIN_DEFAULTS.gemini_api_key;

  if (apiKey && text && String(text).trim().length > 1) {
    try {
      const prompt = `You are an expert English grammar & translation coach for a Turkish speaker chatting in English.
Analyze the user's draft message: "${String(text).trim()}"
(Note: If the user wrote in Turkish or mixed Turkish/English, translate it into natural English and explain the grammar. If they wrote in English with mistakes like "hello ı are omer", fix all grammar/spelling/capitalization mistakes and explain each mistake clearly in Turkish.)

Return ONLY valid JSON (no markdown fences) with this exact structure:
{
  "originalText": "${String(text).replace(/"/g, '\\"')}",
  "hasErrors": true,
  "correctedEn": "The grammatically correct English sentence",
  "naturalAlternativeEn": "A more native/natural or academic way to say it in English",
  "translationTr": "Exact Turkish translation of the intended message",
  "mistakes": [
    {
      "wrong": "the wrong part (e.g. ı are)",
      "right": "the corrected part (e.g. I am)",
      "ruleTitle": "Short Turkish grammar rule title",
      "explanationTr": "Clear Turkish explanation of why it was wrong and how to fix it"
    }
  ],
  "wordBreakdown": [
    { "word": "EnglishWord", "tr": "TurkishMeaning", "pos": "PartOfSpeechInTurkish" }
  ]
}`;

      const gemRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2 },
          }),
        }
      );

      if (gemRes.ok) {
        const gemData = await gemRes.json();
        const rawTxt = gemData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleaned = rawTxt.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed && parsed.correctedEn) {
          return res.json({
            ...localResult,
            ...parsed,
            mistakes:
              Array.isArray(parsed.mistakes) && parsed.mistakes.length > 0
                ? parsed.mistakes
                : localResult.mistakes,
            wordBreakdown:
              Array.isArray(parsed.wordBreakdown) && parsed.wordBreakdown.length > 0
                ? parsed.wordBreakdown
                : localResult.wordBreakdown,
            isAi: true,
          });
        }
      }
    } catch (e) {
      // Gemini erişilemezse yerel deterministik analiz anında devreye girer
    }
  }

  res.json(localResult);
});

app.post('/api/chat/send', auth, async (req, res) => {
  const { roomId = 'global-en', text, useCorrected = false } = req.body;
  if (!text || !String(text).trim()) {
    return res.status(400).json({ error: 'Mesaj boş olamaz' });
  }

  const inspection = localInspectMessage(text);
  const finalSentText = useCorrected && inspection.correctedEn ? inspection.correctedEn : String(text).trim();

  const userMsg = {
    id: Date.now(),
    roomId,
    sender: req.user.username,
    senderBadge: '🇹🇷 Sen',
    originalText: String(text).trim(),
    correctedText: inspection.correctedEn || finalSentText,
    translationTr: inspection.translationTr,
    mistakes: inspection.mistakes || [],
    createdAt: new Date().toISOString(),
  };

  const roomMsgs = ensureDefaultRoomMessages(roomId);
  roomMsgs.push(userMsg);

  if (pgAvailable) {
    await pg(
      `INSERT INTO chat_messages (room_id, sender, sender_badge, original_text, corrected_text, translation_tr, mistakes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW());`,
      [
        roomId,
        userMsg.sender,
        userMsg.senderBadge,
        userMsg.originalText,
        userMsg.correctedText,
        userMsg.translationTr,
        JSON.stringify(userMsg.mistakes),
      ]
    );
  }

  // Partner veya genel odada karşıdan eğitici İngilizce yanıt + çevirisi (Gemini LLM Desteği)
  let replyMsg = null;
  if (!roomId.startsWith('dm-')) {
    const cleanLower = (inspection.correctedEn || finalSentText).toLowerCase();
    const isAiPartner = roomId === 'ai-partner';
    const isLiam = roomId === 'partner-liam';
    const partnerName = isAiPartner ? 'Lingo AI' : isLiam ? 'Prof. Liam' : 'Emma';
    const partnerBadge = isAiPartner ? '🤖 Gemini LLM • Canlı' : isLiam ? '🎓 Oxford • C2' : '🇬🇧 Londra • C1';

    let replyEn = '';
    let replyTr = '';

    const apiKey =
      req.user.settings?.geminiApiKey ||
      process.env.GEMINI_API_KEY ||
      appState.users.admin?.settings?.geminiApiKey;

    if (apiKey) {
      try {
        const historyText = roomMsgs
          .slice(-6)
          .map(m => `${m.sender}: ${m.originalText}`)
          .join('\n');

        const personaDesc = isAiPartner
          ? 'Lingo AI, a world-class, friendly, empathetic conversational AI language partner and coach'
          : isLiam
          ? 'Prof. Liam, an Oxford English linguistics professor and academic mentor'
          : 'Emma, a warm, native conversational friend from London';

        const prompt = `You are ${personaDesc} chatting directly with an English learner inside an interactive chat app.
Chat history:
${historyText}

The student just sent: "${finalSentText}"
(Original student input: "${userMsg.originalText}")
Detected grammar mistakes: ${JSON.stringify(userMsg.mistakes)}

Instructions:
1. Converse naturally, engagingly, and warmly with the student in 1 to 3 conversational sentences.
2. Answer their question, share a thought, and ask an open follow-up question to keep the conversation going.
3. If they made a grammar error, naturally weave the correct phrasing into your response without interrupting the conversation.
4. If they wrote in Turkish, answer helpfully in English and encourage English practice.
5. Provide the exact, accurate Turkish translation of your reply so the student can learn effortlessly.

Respond ONLY with pure JSON (no markdown formatting, no code fences):
{
  "replyEn": "Natural conversational English reply",
  "replyTr": "Bu cümlenin tam Türkçe çevirisi"
}`;

        const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
        for (const m of models) {
          try {
            const gemRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: { temperature: 0.85, maxOutputTokens: 600 },
                }),
              }
            );

            if (gemRes.ok) {
              const gemData = await gemRes.json();
              const rawTxt = gemData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
              const cleaned = rawTxt.replace(/```json/gi, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(cleaned);
              if (parsed && parsed.replyEn) {
                replyEn = parsed.replyEn;
                replyTr = parsed.replyTr || '';
                break;
              }
            }
          } catch (e) {}
        }
      } catch (e) {}
    }

    // Gemini API yanıt vermediyse veya çevrimdışıysa akıllı yerel yanıt havuzu devreye girer
    if (!replyEn) {
      const nameM = (inspection.correctedEn || finalSentText).match(
        /(?:i am|my name is)\s+([a-zA-ZÇĞİÖŞÜçğıöşü]+)/i
      );

      if (nameM) {
        const uName = nameM[1].charAt(0).toUpperCase() + nameM[1].slice(1);
        replyEn = `Nice to meet you, ${uName}! It is wonderful to chat with you. What are your favorite hobbies or goals with English?`;
        replyTr = `Tanıştığımıza memnun oldum ${uName}! Seninle sohbet etmek harika. En sevdiğin hobilerin veya İngilizce ile ilgili hedeflerin neler?`;
      } else if (cleanLower.includes('how are you')) {
        replyEn =
          "I'm feeling energized and ready to chat! Thank you for asking. How was your day today?";
        replyTr = 'Çok enerjik ve sohbete hazırım! Sorduğun için teşekkürler. Bugün günün nasıl geçti?';
      } else if (cleanLower.includes('weather')) {
        replyEn =
          'The weather here is pleasant today! Do you prefer warm, sunny days or cozy rainy weather?';
        replyTr = 'Burada hava bugün gayet güzel! Sıcak, güneşli günleri mi yoksa huzurlu yağmurlu havayı mı seversin?';
      } else if (cleanLower.includes('travel') || cleanLower.includes('country') || cleanLower.includes('trip')) {
        replyEn =
          'Traveling is one of the best ways to practice languages! Which country would you love to visit the most?';
        replyTr = 'Seyahat etmek dil pratiği yapmanın en güzel yollarından biridir! En çok hangi ülkeyi ziyaret etmek isterdin?';
      } else {
        replyEn = `I completely understand what you mean. That's a great thought! Could you tell me a little more about that?`;
        replyTr = `Ne demek istediğini çok iyi anlıyorum. Harika bir düşünce! Bana bundan biraz daha bahsedebilir misin?`;
      }
    }

    replyMsg = {
      id: Date.now() + 1,
      roomId,
      sender: partnerName,
      senderBadge: partnerBadge,
      originalText: replyEn,
      correctedText: replyEn,
      translationTr: replyTr,
      mistakes: [],
      createdAt: new Date(Date.now() + 500).toISOString(),
    };
    roomMsgs.push(replyMsg);

    if (pgAvailable) {
      await pg(
        `INSERT INTO chat_messages (room_id, sender, sender_badge, original_text, corrected_text, translation_tr, mistakes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW());`,
        [
          roomId,
          replyMsg.sender,
          replyMsg.senderBadge,
          replyMsg.originalText,
          replyMsg.correctedText,
          replyMsg.translationTr,
          JSON.stringify([]),
        ]
      );
    }
  }

  saveLocalState();
  res.json({
    success: true,
    sentMessage: userMsg,
    replyMessage: replyMsg,
    inspection,
  });
});


