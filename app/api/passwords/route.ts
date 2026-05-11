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
                sql: 'SELECT * FROM passwords WHERE id = ?',
                args: [id],
            });

            if (result.rows.length === 0) {
                return NextResponse.json({ error: 'Password not found' }, { status: 404 });
            }

            const row = result.rows[0] as unknown as { 
                id: number; 
                website_name: string; 
                url: string; 
                username: string; 
                password: string; 
                notes: string | null; 
                created_at: string 
            };
            return NextResponse.json({
                id: row.id,
                website_name: row.website_name,
                url: row.url,
                username: decrypt(row.username),
                password: decrypt(row.password),
                notes: row.notes ? decrypt(row.notes) : '',
                created_at: row.created_at,
            });
        }

        const result = await db.execute('SELECT * FROM passwords ORDER BY created_at DESC');

        const passwords = result.rows.map((row: unknown) => {
            const r = row as { 
                id: number; 
                website_name: string; 
                url: string; 
                username: string; 
                password: string; 
                notes: string | null; 
                created_at: string 
            };
            return {
                id: r.id,
                website_name: r.website_name,
                url: r.url,
                username: decrypt(r.username),
                password: decrypt(r.password),
                notes: r.notes ? decrypt(r.notes) : '',
                created_at: r.created_at,
            };
        });

        return NextResponse.json(passwords);
    } catch (error) {
        console.error('Database error in GET /api/passwords:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await verifySession();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { website_name, url, username, password, notes } = await request.json();

        await initDB();
        await db.execute({
            sql: 'INSERT INTO passwords (website_name, url, username, password, notes) VALUES (?, ?, ?, ?, ?)',
            args: [website_name, url, encrypt(username), encrypt(password), notes ? encrypt(notes) : null],
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database error in POST /api/passwords:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
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