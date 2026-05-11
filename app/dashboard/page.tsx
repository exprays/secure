import { verifySession } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, FileText, ShieldCheck, Clock, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardOverview() {
    const username = await verifySession();

    return (
        <div className="space-y-10">
            <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-3 text-zinc-400">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">System Secure</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Welcome, {username}</h1>
                <p className="text-zinc-500 text-sm max-w-2xl">Your secure vault is active. You can manage passwords, environment variables, and monitor system security from this dashboard.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md transition-all group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Vault</CardTitle>
                        <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                            <Key className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-zinc-900 mb-2">Passwords</div>
                        <p className="text-xs text-zinc-500 mb-6 leading-relaxed">Securely store and manage your credentials with military-grade encryption.</p>
                        <Link href="/dashboard/passwords">
                            <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg h-10 font-medium text-sm transition-all shadow-sm">Open Vault</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md transition-all group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Configs</CardTitle>
                        <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                            <FileText className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-zinc-900 mb-2">Environments</div>
                        <p className="text-xs text-zinc-500 mb-6 leading-relaxed">Manage your project .env files and configuration secrets centrally.</p>
                        <Link href="/dashboard/env-files">
                            <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg h-10 font-medium text-sm transition-all shadow-sm">Open Configs</Button>
                        </Link>
                    </CardContent>
                </Card>
                
                <Card className="bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md transition-all group overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold text-zinc-400 uppercase tracking-wider">System Status</CardTitle>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </CardHeader>
                    <CardContent className="pt-4 flex flex-col justify-between h-[160px]">
                        <div>
                            <div className="text-2xl font-bold text-zinc-900 mb-2">Online</div>
                            <p className="text-xs text-zinc-500 leading-relaxed">All systems operational. End-to-end encryption is active for all vault data.</p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 -mx-6 -mb-6 px-6 py-4 mt-4 border-t border-zinc-100">
                            <Clock className="w-3 h-3" />
                            Updated 2m ago
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div className="bg-zinc-900 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-xl font-bold mb-2">Need Help?</h2>
                    <p className="text-zinc-400 text-sm max-w-md mb-6">Learn more about how to secure your vault and manage your team&apos;s access controls.</p>
                    <Button className="bg-white hover:bg-zinc-100 text-zinc-900 rounded-lg font-medium text-sm border-none px-6">Documentation</Button>
                </div>
                <Shield className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/5" />
            </div>
        </div>
    );
}