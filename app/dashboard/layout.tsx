import { redirect } from 'next/navigation';
import { verifySession } from '@/lib/auth';
import DashboardClientLayout from '@/components/DashboardClientLayout';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const username = await verifySession();

    if (!username) {
        redirect('/login');
    }

    return <DashboardClientLayout username={username}>{children}</DashboardClientLayout>;
}