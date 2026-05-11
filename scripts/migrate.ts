import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function migrate() {
    console.log('Starting migration...');
    
    const columns = [
        { name: 'is_deployed', type: 'INTEGER DEFAULT 0' },
        { name: 'progress', type: 'INTEGER DEFAULT 0' },
        { name: 'dev_status', type: 'TEXT DEFAULT \'Planning\'' }
    ];

    for (const col of columns) {
        try {
            console.log(`Adding column ${col.name}...`);
            await db.execute(`ALTER TABLE workspaces ADD COLUMN ${col.name} ${col.type}`);
            console.log(`Successfully added ${col.name}`);
        } catch (error: any) {
            if (error.message.includes('duplicate column name')) {
                console.log(`Column ${col.name} already exists, skipping.`);
            } else {
                console.error(`Error adding column ${col.name}:`, error.message);
            }
        }
    }

    console.log('Migration finished.');
}

migrate();
