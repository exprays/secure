import { NextRequest, NextResponse } from 'next/server';
import { db, initDB } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

        await initDB();

        // Fetch portal and workspace info
        const portalResult = await db.execute({
            sql: `
                SELECT cp.*, w.name as workspace_name, w.type as workspace_type, 
                       w.domain, w.deployment_url, w.repository_url, w.progress, w.dev_status
                FROM client_portals cp
                JOIN workspaces w ON cp.workspace_id = w.id
                WHERE cp.slug = ? AND cp.is_active = 1
            `,
            args: [slug],
        });

        if (portalResult.rows.length === 0) {
            return NextResponse.json({ error: 'Portal not found or inactive' }, { status: 404 });
        }

        const portal = portalResult.rows[0];

        // Fetch portal content
        const contentResult = await db.execute({
            sql: 'SELECT * FROM portal_content WHERE portal_id = ? ORDER BY created_at DESC',
            args: [portal.id],
        });

        return NextResponse.json({
            portal,
            content: contentResult.rows
        });
    } catch (error) {
        console.error('Database error in GET /api/portals/public:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
