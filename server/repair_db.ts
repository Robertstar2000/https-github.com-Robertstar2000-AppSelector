import { db } from './db';

const runRepair = async () => {
    console.log('Repairing Database...');
    try {
        await db.run(`
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
            )
        `);
        console.log('Apps table created successfully.');

        // Check if it exists now
        const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='apps'");
        console.log('Tables found:', tables);

    } catch (error) {
        console.error('Repair failed:', error);
    }
};

runRepair();
