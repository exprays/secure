import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { db, initDB } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const user = await verifySession();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const portal_id = searchParams.get('portal_id');

        if (!portal_id) return NextResponse.json({ error: 'Portal ID is required' }, { status: 400 });

        await initDB();

        const result = await db.execute({
            sql: 'SELECT * FROM portal_content WHERE portal_id = ? ORDER BY created_at DESC',
            args: [portal_id],
        });

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Database error in GET /api/portals/content:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await verifySession();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { portal_id, type, title, description, metadata } = body;

        if (!portal_id || !type || !title) {
            return NextResponse.json({ error: 'Portal ID, Type, and Title are required' }, { status: 400 });
        }

        await initDB();
        await db.execute({
            sql: `INSERT INTO portal_content (portal_id, type, title, description, metadata) 
                  VALUES (?, ?, ?, ?, ?)`,
            args: [portal_id, type, title, description || null, metadata ? JSON.stringify(metadata) : null],
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database error in POST /api/portals/content:', error);
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
            sql: 'DELETE FROM portal_content WHERE id = ?',
            args: [id],
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database error in DELETE /api/portals/content:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
