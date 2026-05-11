import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { db } from '@/lib/db';
import { encrypt, decrypt } from '@/lib/encryption';

export async function GET() {
    const user = await verifySession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const result = await db.execute('SELECT * FROM passwords ORDER BY created_at DESC');

    const passwords = result.rows.map((row: any) => ({
        id: row.id,
        website_name: row.website_name,
        url: row.url,
        username: decrypt(row.username),
        password: decrypt(row.password),
        notes: row.notes ? decrypt(row.notes) : '',
        created_at: row.created_at,
    }));

    return NextResponse.json(passwords);
}

export async function POST(request: NextRequest) {
    const user = await verifySession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { website_name, url, username, password, notes } = await request.json();

    await db.execute({
        sql: 'INSERT INTO passwords (website_name, url, username, password, notes) VALUES (?, ?, ?, ?, ?)',
        args: [website_name, url, encrypt(username), encrypt(password), notes ? encrypt(notes) : null],
    });

    return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
    const user = await verifySession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await db.execute({
        sql: 'DELETE FROM passwords WHERE id = ?',
        args: [id],
    });

    return NextResponse.json({ success: true });
}