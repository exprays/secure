'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
    Globe, Shield, Clock, ExternalLink, 
    FileText, CreditCard, Calendar, CheckCircle2, 
    MessageSquare, Info, Briefcase, User,
    Rocket, ChevronRight, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PortalData {
    portal: {
        id: number;
        workspace_name: string;
        workspace_type: string;
        domain: string;
        deployment_url: string;
        repository_url: string;
        progress: number;
        dev_status: string;
    };
    content: Array<{
        id: number;
        type: string;
        title: string;
        description: string;
        metadata: string;
        created_at: string;
    }>;
}

export default function PublicPortalPage() {
    const { slug } = useParams();
    const [data, setData] = useState<PortalData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPortal = async () => {
            try {
                const res = await fetch(`/api/portals/public?slug=${slug}`);
                if (!res.ok) {
                    setError('Portal not found or inactive');
                    return;
                }
                const portalData = await res.json();
                setData(portalData);
            } catch (err) {
                setError('Failed to load portal');
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchPortal();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-zinc-900/10 border-t-zinc-900 rounded-full animate-spin" />
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Authenticating Portal Access...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-6">
                    <div className="w-20 h-20 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100 shadow-sm">
                        <Shield className="w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Private Portal</h1>
                        <p className="text-sm text-zinc-500">{error || 'This portal is currently unavailable or set to private by the administrator.'}</p>
                    </div>
                    <Button variant="outline" className="border-zinc-300 rounded-xl" onClick={() => window.location.reload()}>Retry Connection</Button>
                </div>
            </div>
        );
    }

    const { portal, content } = data;

    const contentTypes: any = {
        update: { label: 'Project Update', icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
        invoice: { label: 'Invoice', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        timeline: { label: 'Timeline Event', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50' },
        changelog: { label: 'Changelog', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' },
        file: { label: 'Shared File', icon: FileText, color: 'text-zinc-600', bg: 'bg-zinc-100' },
        approval: { label: 'Approval Request', icon: CheckCircle2, color: 'text-orange-500', bg: 'bg-orange-50' },
        note: { label: 'Meeting Note', icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-zinc-900 selection:text-white">
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-zinc-900/10">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block leading-tight">Project Portal</span>
                            <span className="text-sm font-bold text-zinc-900">{portal.workspace_name}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-full border border-zinc-200">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">System Secure</span>
                        </div>
                        <Button className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-6 h-10 font-bold text-xs uppercase tracking-widest transition-all shadow-sm">
                            Support Contact
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Left Sidebar: Project Summary */}
                    <aside className="lg:col-span-4 space-y-8">
                        <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                                    <Rocket className="w-3 h-3" /> {portal.dev_status}
                                </div>
                                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-4 leading-tight">
                                    {portal.workspace_name}
                                </h1>
                                <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
                                    Welcome to your dedicated project portal. Here you can track real-time progress, download assets, and manage approvals.
                                </p>
                                
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Completion Progress</span>
                                            <span className="text-xs font-bold text-zinc-900">{portal.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-zinc-900 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${portal.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Type</p>
                                            <div className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                                                {portal.workspace_type === 'Client' ? <Briefcase className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                                {portal.workspace_type}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                                            <div className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                                Active
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Globe className="absolute right-[-40px] bottom-[-40px] w-64 h-64 text-zinc-900/5 group-hover:text-zinc-900/10 transition-colors duration-500" />
                        </div>

                        {/* Quick Access Infrastructure */}
                        <div className="bg-zinc-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-zinc-900/20">
                            <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-6">Live Links</h3>
                            <div className="space-y-3 relative z-10">
                                {portal.deployment_url && (
                                    <a href={portal.deployment_url.startsWith('http') ? portal.deployment_url : `https://${portal.deployment_url}`} target="_blank" rel="noopener noreferrer" className="block">
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all group/link">
                                            <span className="flex items-center gap-3 text-sm font-bold">
                                                <Rocket className="w-4 h-4 text-white/60" /> Production
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-white/30 group-hover/link:translate-x-1 transition-all" />
                                        </div>
                                    </a>
                                )}
                                {portal.domain && (
                                    <a href={portal.domain.startsWith('http') ? portal.domain : `https://${portal.domain}`} target="_blank" rel="noopener noreferrer" className="block">
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all group/link">
                                            <span className="flex items-center gap-3 text-sm font-bold">
                                                <Globe className="w-4 h-4 text-white/60" /> Public URL
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-white/30 group-hover/link:translate-x-1 transition-all" />
                                        </div>
                                    </a>
                                )}
                            </div>
                            <Shield className="absolute right-[-20px] top-[-20px] w-48 h-48 text-white/[0.03]" />
                        </div>
                    </aside>

                    {/* Right Column: Project Timeline/Feed */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Project Activity</h2>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Filter by</span>
                                <div className="h-8 px-4 bg-zinc-100 rounded-full flex items-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest border border-zinc-200">
                                    Latest Entries
                                </div>
                            </div>
                        </div>

                        <div className="relative space-y-8">
                            {/* Vertical Line for Timeline */}
                            <div className="absolute left-10 top-0 bottom-0 w-px bg-zinc-200 hidden md:block" />

                            {content.length === 0 ? (
                                <div className="py-20 text-center border-2 border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50">
                                    <Info className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-zinc-900 mb-1">No Activity Yet</h3>
                                    <p className="text-sm text-zinc-500 max-w-xs mx-auto">Check back later for project updates, invoices, and files shared by your project manager.</p>
                                </div>
                            ) : (
                                content.map((item) => {
                                    const type = contentTypes[item.type] || contentTypes.update;
                                    return (
                                        <div key={item.id} className="relative pl-0 md:pl-24 group">
                                            {/* Timeline Bullet */}
                                            <div className="absolute left-8 top-8 w-4 h-4 rounded-full bg-white border-2 border-zinc-900 z-10 hidden md:block shadow-[0_0_0_4px_white]" />
                                            
                                            <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm hover:shadow-lg hover:border-zinc-300 transition-all duration-300">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border border-zinc-100 shadow-sm transition-transform group-hover:scale-110 duration-300", type.bg, type.color)}>
                                                            <type.icon className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-zinc-100 shadow-sm", type.bg, type.color)}>
                                                                    {type.label}
                                                                </span>
                                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" /> {new Date(item.created_at).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">{item.title}</h3>
                                                        </div>
                                                    </div>
                                                    {item.type === 'file' && (
                                                        <Button variant="outline" className="rounded-full border-zinc-300 h-9 px-5 text-xs font-bold uppercase tracking-widest gap-2 hover:bg-zinc-50">
                                                            <Download className="w-3.5 h-3.5" /> Access File
                                                        </Button>
                                                    )}
                                                    {item.type === 'invoice' && (
                                                        <Button className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full h-9 px-6 text-xs font-bold uppercase tracking-widest transition-all">
                                                            View Statement
                                                        </Button>
                                                    )}
                                                </div>
                                                
                                                <div className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap max-w-3xl border-l-2 border-zinc-100 pl-6 py-1">
                                                    {item.description}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-20 py-12 border-t border-zinc-200 bg-zinc-50/50">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-2 opacity-40">
                        <Shield className="w-4 h-4 text-zinc-900" />
                        <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.3em]">SECURE ACCESS CONTROL</span>
                    </div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Powered by sPANEL Secure Systems • &copy; {new Date().getFullYear()}
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors">Privacy</a>
                        <a href="#" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors">Security</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
