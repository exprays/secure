import { createClient } from '@libsql/client';

export const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function initDB() {
    await db.execute(`
    CREATE TABLE IF NOT EXISTS passwords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      website_name TEXT NOT NULL,
      url TEXT NOT NULL,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    await db.execute(`
    CREATE TABLE IF NOT EXISTS env_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_name TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    await db.execute(`
    CREATE TABLE IF NOT EXISTS workspaces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL, -- 'Client' | 'Personal'
      domain TEXT,
      deployment_url TEXT,
      repository_url TEXT,
      invoices TEXT,
      docs_url TEXT,
      api_keys TEXT,
      timeline TEXT,
      is_deployed INTEGER DEFAULT 0, -- 0 for Not Deployed, 1 for Deployed
      progress INTEGER DEFAULT 0,    -- 0 to 100
      dev_status TEXT DEFAULT 'Planning', -- 'Planning' | 'In Progress' | 'On Hold' | 'Completed'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

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

    await db.execute(`
    CREATE TABLE IF NOT EXISTS portal_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      portal_id INTEGER NOT NULL,
      type TEXT NOT NULL, -- 'update', 'invoice', 'timeline', 'changelog', 'file', 'approval', 'note'
      title TEXT NOT NULL,
      description TEXT,
      metadata TEXT, -- JSON string
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (portal_id) REFERENCES client_portals (id) ON DELETE CASCADE
    )
  `);
}