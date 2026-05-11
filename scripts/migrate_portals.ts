import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function migrate() {
    console.log('Starting Client Portal migration...');
    
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS client_portals (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              workspace_id INTEGER NOT NULL,
              slug TEXT NOT NULL UNIQUE,
              is_active INTEGER DEFAULT 1,
              password_hash TEXT,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE
            )
        `);
        console.log('Created client_portals table');

        await db.execute(`
            CREATE TABLE IF NOT EXISTS portal_content (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              portal_id INTEGER NOT NULL,
              type TEXT NOT NULL,
              title TEXT NOT NULL,
              description TEXT,
              metadata TEXT,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (portal_id) REFERENCES client_portals (id) ON DELETE CASCADE
            )
        `);
        console.log('Created portal_content table');
    } catch (error: unknown) {
        console.error('Migration error:', (error as Error).message);
    }

    console.log('Migration finished.');
}

migrate();
