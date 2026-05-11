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
                sql: 'SELECT * FROM workspaces WHERE id = ?',
                args: [id],
            });

            if (result.rows.length === 0) {
                return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
            }

            return NextResponse.json(result.rows[0]);
        }

        const result = await db.execute('SELECT * FROM workspaces ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Database error in GET /api/workspaces:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await verifySession();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { 
            name, type, domain, deployment_url, repository_url, 
            invoices, docs_url, api_keys, timeline 
        } = body;

        if (!name || !type) {
            return NextResponse.json({ error: 'Name and Type are required' }, { status: 400 });
        }

        await initDB();
        await db.execute({
            sql: `INSERT INTO workspaces (
                name, type, domain, deployment_url, repository_url, 
                invoices, docs_url, api_keys, timeline
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                name, type, domain || null, deployment_url || null, repository_url || null, 
                invoices || null, docs_url || null, api_keys || null, timeline || null
            ],
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database error in POST /api/workspaces:', error);
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
            sql: 'DELETE FROM workspaces WHERE id = ?',
            args: [id],
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database error in DELETE /api/workspaces:', error);
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
            sql: `UPDATE workspaces SET ${setClause} WHERE id = ?`,
            args: [...Object.values(updates), id],
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database error in PATCH /api/workspaces:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
