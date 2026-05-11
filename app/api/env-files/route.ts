import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { db, initDB } from '@/lib/db';
import { encrypt, decrypt } from '@/lib/encryption';

export async function GET(request: NextRequest) {
    try {
        const user = await verifySession();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await initDB();

        if (id) {
            const result = await db.execute({
                sql: 'SELECT * FROM env_files WHERE id = ?',
                args: [id],
            });

            if (result.rows.length === 0) {
                return NextResponse.json({ error: 'Env file not found' }, { status: 404 });
            }

            const row = result.rows[0] as unknown as { id: number; project_name: string; content: string; created_at: string };
            return NextResponse.json({
                id: row.id,
                project_name: row.project_name,
                content: decrypt(row.content),
                created_at: row.created_at,
            });
        }

        const result = await db.execute('SELECT * FROM env_files ORDER BY created_at DESC');

        const envFiles = result.rows.map((row: unknown) => {
            const r = row as { id: number; project_name: string; content: string; created_at: string };
            return {
                id: r.id,
                project_name: r.project_name,
                content: decrypt(r.content),
                created_at: r.created_at,
            };
        });

        return NextResponse.json(envFiles);
    } catch (error) {
        console.error('Database error in GET /api/env-files:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await verifySession();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { project_name, content } = await request.json();

        await initDB();
        await db.execute({
            sql: 'INSERT INTO env_files (project_name, content) VALUES (?, ?)',
            args: [project_name, encrypt(content)],
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database error in POST /api/env-files:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const user = await verifySession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await db.execute({
        sql: 'DELETE FROM env_files WHERE id = ?',
        args: [id],
    });

    return NextResponse.json({ success: true });
}