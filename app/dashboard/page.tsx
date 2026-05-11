import { verifySession } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, FileText, Activity } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardOverview() {
    const username = await verifySession();

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-black tracking-tighter mb-2 text-black uppercase">Welcome, {username}</h1>
                <p className="text-black font-medium opacity-50 uppercase tracking-[0.2em] text-sm">Dashboard Overview</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-white border-2 border-black rounded-none shadow-none group transition-transform hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between pb-4 border-b-2 border-black">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em]">Passwords</CardTitle>
                        <Key className="w-5 h-5 text-black" />
                    </CardHeader>
                    <CardContent className="pt-8">
                        <div className="text-3xl font-black text-black mb-1 uppercase tracking-tighter">Vault</div>
                        <p className="text-xs text-black opacity-50 mb-8 font-bold uppercase tracking-widest leading-relaxed">Manage your securely encrypted credentials</p>
                        <Link href="/dashboard/passwords">
                            <Button className="w-full bg-black hover:bg-zinc-800 text-white rounded-none font-black h-12 uppercase tracking-tighter transition-colors">Access Vault</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="bg-white border-2 border-black rounded-none shadow-none group transition-transform hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between pb-4 border-b-2 border-black">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em]">Environments</CardTitle>
                        <FileText className="w-5 h-5 text-black" />
                    </CardHeader>
                    <CardContent className="pt-8">
                        <div className="text-3xl font-black text-black mb-1 uppercase tracking-tighter">Configs</div>
                        <p className="text-xs text-black opacity-50 mb-8 font-bold uppercase tracking-widest leading-relaxed">Centrally manage environment variables</p>
                        <Link href="/dashboard/env-files">
                            <Button className="w-full bg-black hover:bg-zinc-800 text-white rounded-none font-black h-12 uppercase tracking-tighter transition-colors">Access Configs</Button>
                        </Link>
                    </CardContent>
                </Card>
                
                <Card className="bg-white border-2 border-black rounded-none shadow-none group transition-transform hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between pb-4 border-b-2 border-black">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em]">Status</CardTitle>
                        <Activity className="w-5 h-5 text-black" />
                    </CardHeader>
                    <CardContent className="pt-8 text-center flex flex-col justify-center h-[180px]">
                        <div className="text-5xl font-black text-black mb-2 uppercase tracking-tighter">Online</div>
                        <p className="text-xs text-black opacity-50 font-bold uppercase tracking-widest">Systems Secure</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}