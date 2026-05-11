'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Key, FileText, LogOut, Menu, X, LayoutDashboard, Search, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
        { href: '/dashboard/workspaces', label: 'Workspaces', icon: Briefcase },
        { href: '/dashboard/portals', label: 'Client Portals', icon: LayoutDashboard },
        { href: '/dashboard/passwords', label: 'Passwords', icon: Key },
        { href: '/dashboard/env-files', label: 'ENV Files', icon: FileText },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans text-zinc-900">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-zinc-200 z-30">
                <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
                    <Shield className="w-5 h-5 text-zinc-900" />
                    Vault
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-md">
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
            </div>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-50/50 border-r border-zinc-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    <div className="p-6">
                        <div className="flex items-center gap-2 font-bold text-xl tracking-tight mb-6 hidden md:flex">
                            <Shield className="w-6 h-6 text-zinc-900" />
                            sPANEL
                        </div>

                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input
                                placeholder="Search..."
                                className="pl-9 h-9 bg-white/50 border-zinc-200 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-zinc-400"
                            />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="px-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Navigation</h3>
                                <nav className="space-y-1">
                                    {navItems.map((item) => {
                                        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                                        return (
                                            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                                                <div className={cn(
                                                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium",
                                                    isActive
                                                        ? "bg-white border border-zinc-200 shadow-sm text-zinc-900"
                                                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                                                )}>
                                                    <item.icon className={cn("w-4 h-4", isActive ? "text-zinc-900" : "text-zinc-400")} />
                                                    {item.label}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto p-4 border-t border-zinc-200">
                        <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl border border-zinc-200 bg-white shadow-sm">
                            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-bold text-zinc-900 truncate">{username}</p>
                                <p className="text-[10px] text-zinc-400">Admin Account</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg h-10 px-3 text-xs font-medium transition-colors"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-white custom-scrollbar">
                <div className="p-6 md:p-10 w-full mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
