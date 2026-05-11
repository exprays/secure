'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Key, FileText, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardClientLayoutProps {
    children: React.ReactNode;
    username: string;
}

export default function DashboardClientLayout({ children, username }: DashboardClientLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    const navItems = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
        { href: '/dashboard/passwords', label: 'Passwords', icon: Key },
        { href: '/dashboard/env-files', label: 'ENV Files', icon: FileText },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans text-black">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b-2 border-black z-30">
                <div className="flex items-center gap-2 font-black text-xl text-black tracking-tighter uppercase">
                    <Shield className="w-6 h-6" />
                    Secure Vault
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-none">
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
            </div>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r-2 border-black transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    <div className="p-6 flex items-center gap-3 font-black text-2xl border-b-2 border-black hidden md:flex text-black tracking-tighter uppercase">
                        <Shield className="w-8 h-8" />
                        Secure Vault
                    </div>
                    
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        <div className="text-xs font-black text-black opacity-30 uppercase tracking-[0.2em] mb-4 px-3 mt-4">Navigation</div>
                        {navItems.map((item) => {
                            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                            return (
                                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                                    <div className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-none transition-colors font-bold uppercase tracking-tighter",
                                        isActive 
                                            ? "bg-black text-white" 
                                            : "text-black hover:bg-zinc-100"
                                    )}>
                                        <item.icon className="w-5 h-5" />
                                        {item.label}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t-2 border-black">
                        <div className="flex items-center gap-3 px-4 py-4 mb-4 bg-white border-2 border-black">
                            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg">
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-black truncate uppercase tracking-tighter">{username}</p>
                                <p className="text-[10px] font-bold opacity-50 uppercase tracking-[0.1em]">Admin</p>
                            </div>
                        </div>
                        <Button variant="ghost" className="w-full justify-start text-black hover:bg-zinc-100 rounded-none py-6 font-black uppercase tracking-tighter border-2 border-black transition-colors" onClick={handleLogout}>
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-white">
                <div className="p-6 md:p-12 max-w-6xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
