import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const { username, password } = await request.json();

    const userMatch = username === process.env.ADMIN_USERNAME;
    const passMatch = password === process.env.ADMIN_PASSWORD;
    
    console.log('Login debug:', { 
        userMatch, 
        passMatch,
        receivedUser: username,
        expectedUser: process.env.ADMIN_USERNAME,
        receivedPassLength: password?.length,
        expectedPassLength: process.env.ADMIN_PASSWORD?.length
    });
    
    if (userMatch && passMatch) {
        await createSession(username);
        return NextResponse.json({ success: true });
    }

    console.log('Login failed: Credentials mismatch');
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
}