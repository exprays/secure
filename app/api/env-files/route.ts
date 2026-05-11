import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { db } from '@/lib/db';
import { encrypt, decrypt } from '@/lib/encryption';

export async function GET() {
    const user = await verifySession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const result = await db.execute('SELECT * FROM env_files ORDER BY created_at DESC');

    const envFiles = result.rows.map((row: any) => ({
        id: row.id,
        project_name: row.project_name,
        content: decrypt(row.content),
        created_at: row.created_at,
    }));

    return NextResponse.json(envFiles);
}

export async function POST(request: NextRequest) {
    const user = await verifySession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { project_name, content } = await request.json();

    await db.execute({
        sql: 'INSERT INTO env_files (project_name, content) VALUES (?, ?)',
        args: [project_name, encrypt(content)],
    });

    return NextResponse.json({ success: true });
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