import { db } from './db';

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usage_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE,
  action TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS apps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  status TEXT,
  type TEXT,
  url TEXT,
  sort_order INTEGER DEFAULT 0,
  owner TEXT,
  source_url TEXT,
  backend_port TEXT,
  ai_model TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const initDb = async () => {
    console.log('Initializing Database...');

    // Sequential Schema Protocol
    // Postgres drivers often fail on multi-statement strings.
    // We split by ';' and execute sequentially.
    const statements = schema
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    try {
        // In a real app we might want to wrap this in a transaction or allow partial success if suitable
        for (const statement of statements) {
            console.log(`Executing: ${statement.substring(0, 50)}...`);
            await db.run(statement);
        }
        console.log('Database initialization complete.');
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    initDb();
}

export { initDb };
