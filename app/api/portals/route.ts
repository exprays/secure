import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { db, initDB } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const user = await verifySession();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await initDB();

        if (id) {
            const result = await db.execute({
                sql: `
                    SELECT cp.*, w.name as workspace_name, w.type as workspace_type 
                    FROM client_portals cp
                    JOIN workspaces w ON cp.workspace_id = w.id
                    WHERE cp.id = ?
                `,
                args: [id],
            });

            if (result.rows.length === 0) {
                return NextResponse.json({ error: 'Portal not found' }, { status: 404 });
            }

            return NextResponse.json(result.rows[0]);
        }

        const result = await db.execute(`
            SELECT cp.*, w.name as workspace_name 
            FROM client_portals cp
            JOIN workspaces w ON cp.workspace_id = w.id
            ORDER BY cp.created_at DESC
        `);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Database error in GET /api/portals:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await verifySession();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { workspace_id, slug } = body;

        if (!workspace_id || !slug) {
            return NextResponse.json({ error: 'Workspace ID and Slug are required' }, { status: 400 });
        }

        await initDB();
        
        // Check if slug is unique
        const existing = await db.execute({
            sql: 'SELECT id FROM client_portals WHERE slug = ?',
            args: [slug],
        });

        if (existing.rows.length > 0) {
            return NextResponse.json({ error: 'Slug already in use' }, { status: 400 });
        }

        await db.execute({
            sql: 'INSERT INTO client_portals (workspace_id, slug) VALUES (?, ?)',
            args: [workspace_id, slug],
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database error in POST /api/portals:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const user = await verifySession();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        await initDB();

        const keys = Object.keys(updates);
        if (keys.length === 0) return NextResponse.json({ error: 'No updates provided' }, { status: 400 });

        const setClause = keys.map(key => `${key} = ?`).join(', ');
        
        await db.execute({
            sql: `UPDATE client_portals SET ${setClause} WHERE id = ?`,
            args: [...Object.values(updates), id],
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database error in PATCH /api/portals:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const user = await verifySession();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        await initDB();
        await db.execute({
            sql: 'DELETE FROM client_portals WHERE id = ?',
            args: [id],
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database error in DELETE /api/portals:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
