'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
    ArrowLeft, Plus, Trash2, Globe, Shield, 
    Clock, ExternalLink, FileText, CreditCard, 
    Calendar, CheckCircle2, MessageSquare, Info,
    X, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Portal {
    id: number;
    workspace_name: string;
    workspace_type: string;
    slug: string;
    is_active: number;
}

interface Content {
    id: number;
    type: string;
    title: string;
    description: string;
    metadata: string;
    created_at: string;
}

export default function PortalDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [portal, setPortal] = useState<Portal | null>(null);
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const [newContent, setNewContent] = useState({
        type: 'update',
        title: '',
        description: '',
    });

    const fetchPortal = async () => {
        try {
            const res = await fetch(`/api/portals?id=${id}`);
            if (!res.ok) {
                router.push('/dashboard/portals');
                return;
            }
            const data = await res.json();
            setPortal(data);
        } catch (error) {
            console.error('Error fetching portal:', error);
        }
    };

    const fetchContent = async () => {
        try {
            const res = await fetch(`/api/portals/content?portal_id=${id}`);
            const data = await res.json();
            setContents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    };

    useEffect(() => {
        fetchPortal();
        fetchContent();
        setLoading(false);
    }, [id]);

    const handleAddContent = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const res = await fetch('/api/portals/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ portal_id: id, ...newContent }),
            });
            if (res.ok) {
                setNewContent({ type: 'update', title: '', description: '' });
                fetchContent();
            }
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteContent = async (contentId: number) => {
        if (confirm('Delete this entry?')) {
            await fetch(`/api/portals/content?id=${contentId}`, { method: 'DELETE' });
            fetchContent();
        }
    };

    const togglePortalStatus = async () => {
        if (!portal) return;
        const newStatus = portal.is_active ? 0 : 1;
        await fetch('/api/portals', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: portal.id, is_active: newStatus }),
        });
        setPortal({ ...portal, is_active: newStatus });
    };

    if (loading || !portal) return null;

    const contentTypes = [
        { value: 'update', label: 'Project Update', icon: Info, color: 'text-blue-500' },
        { value: 'invoice', label: 'Invoice', icon: CreditCard, color: 'text-emerald-500' },
        { value: 'timeline', label: 'Timeline Event', icon: Calendar, color: 'text-amber-500' },
        { value: 'changelog', label: 'Changelog', icon: Clock, color: 'text-purple-500' },
        { value: 'file', label: 'Shared File/Link', icon: FileText, color: 'text-zinc-600' },
        { value: 'approval', label: 'Approval Request', icon: CheckCircle2, color: 'text-orange-500' },
        { value: 'note', label: 'Meeting Note', icon: MessageSquare, color: 'text-indigo-500' },
    ];

    return (
        <div className="space-y-8 pb-20 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <Link href="/dashboard/portals">
                    <Button variant="ghost" className="rounded-xl h-10 px-4 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 font-medium text-sm transition-all border border-transparent hover:border-zinc-200">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Portals
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <a href={`/portal/${portal.slug}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="rounded-xl h-10 px-4 border-zinc-300 font-semibold text-xs uppercase tracking-widest hover:bg-zinc-50">
                            Public Preview <ExternalLink className="ml-2 w-3.5 h-3.5" />
                        </Button>
                    </a>
                    <Button 
                        onClick={togglePortalStatus}
                        className={cn(
                            "rounded-xl h-10 px-6 font-bold text-xs uppercase tracking-widest transition-all",
                            portal.is_active ? "bg-zinc-900 text-white" : "bg-red-50 text-red-600 border border-red-100"
                        )}
                    >
                        {portal.is_active ? 'Portal Live' : 'Portal Offline'}
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Header */}
                    <div className="bg-white rounded-2xl border border-zinc-300 p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-white">
                                <Globe className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-zinc-900">{portal.workspace_name}</h1>
                                <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest">/portal/{portal.slug}</p>
                            </div>
                        </div>
                    </div>

                    {/* Add Content Form */}
                    <div className="bg-white rounded-2xl border border-zinc-300 shadow-sm overflow-hidden">
                        <div className="px-8 py-5 border-b border-zinc-200 bg-zinc-50/30">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Post New Portal Content</h3>
                        </div>
                        <div className="p-8">
                            <form onSubmit={handleAddContent} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Content Type</Label>
                                        <Select 
                                            value={newContent.type} 
                                            onValueChange={(v) => setNewContent({ ...newContent, type: v })}
                                        >
                                            <SelectTrigger className="!h-11 border-zinc-300 rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {contentTypes.map(t => (
                                                    <SelectItem key={t.value} value={t.value}>
                                                        <div className="flex items-center gap-2">
                                                            <t.icon className={cn("w-4 h-4", t.color)} />
                                                            {t.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Entry Title</Label>
                                        <Input 
                                            placeholder="e.g. Q4 Invoice, Sprint 5 Update..."
                                            value={newContent.title}
                                            onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                                            className="h-11 border-zinc-300 rounded-xl focus-visible:ring-zinc-900"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Detailed Description / Content</Label>
                                    <Textarea 
                                        placeholder="Add more context, links, or details here..."
                                        value={newContent.description}
                                        onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                                        className="min-h-[120px] border-zinc-300 rounded-xl focus-visible:ring-zinc-900 resize-none"
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={isCreating || !newContent.title}
                                    className="h-12 px-8 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 ml-auto"
                                >
                                    {isCreating ? 'Posting...' : 'Post to Client Portal'}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Content List */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-2">Published Timeline</h3>
                        {contents.length === 0 ? (
                            <div className="p-12 text-center border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
                                <p className="text-sm font-medium text-zinc-400">The portal timeline is currently empty.</p>
                            </div>
                        ) : (
                            contents.map((item) => {
                                const typeInfo = contentTypes.find(t => t.value === item.type) || contentTypes[0];
                                return (
                                    <div key={item.id} className="bg-white rounded-2xl border border-zinc-300 p-6 shadow-sm hover:border-zinc-400 transition-all group">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className={cn("w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-200", typeInfo.color)}>
                                                    <typeInfo.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h4 className="font-bold text-zinc-900 truncate">{item.title}</h4>
                                                        <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border bg-zinc-50 uppercase tracking-tighter", typeInfo.color, "border-zinc-200")}>
                                                            {typeInfo.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-zinc-500 leading-relaxed whitespace-pre-wrap">{item.description}</p>
                                                    <div className="flex items-center gap-2 mt-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(item.created_at).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => handleDeleteContent(item.id)}
                                                className="w-8 h-8 rounded-lg text-zinc-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Portal Stats */}
                    <div className="bg-white rounded-2xl border border-zinc-300 shadow-sm overflow-hidden">
                        <div className="px-8 py-5 border-b border-zinc-200 bg-zinc-50/30">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Portal Overview</h3>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Status</span>
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-2 h-2 rounded-full", portal.is_active ? "bg-green-500" : "bg-red-500")} />
                                    <span className="text-xs font-bold text-zinc-900 uppercase tracking-widest">{portal.is_active ? 'Live' : 'Hidden'}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Entries</span>
                                <span className="text-xs font-bold text-zinc-900">{contents.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Access</span>
                                <span className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Public</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Tips */}
                    <div className="bg-zinc-900 rounded-2xl p-8 text-white relative overflow-hidden">
                        <h4 className="text-lg font-bold mb-2 relative z-10">Client Access</h4>
                        <p className="text-zinc-400 text-xs mb-6 relative z-10 leading-relaxed">
                            Clients do not need to log in. Share the secret slug URL to give them access to this project portal.
                        </p>
                        <Button className="w-full bg-white hover:bg-zinc-100 text-zinc-900 rounded-xl h-10 font-bold text-[10px] uppercase tracking-widest border-none">
                            Help Center
                        </Button>
                        <Shield className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white/5" />
                    </div>
                </div>
            </div>
        </div>
    );
}
