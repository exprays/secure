'use client';

import { useState, useEffect } from 'react';
import {
    Plus, Search, LayoutDashboard, ExternalLink,
    Trash2, Globe, Shield, Clock, ArrowRight,
    Check, Copy, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from 'next/link';

interface Workspace {
    id: number;
    name: string;
}

interface Portal {
    id: number;
    workspace_id: number;
    workspace_name: string;
    slug: string;
    is_active: number;
    created_at: string;
}

export default function PortalsTab() {
    const [portals, setPortals] = useState<Portal[]>([]);
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [copiedSlug, setCopiedSlug] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        workspace_id: '',
        slug: '',
    });

    const fetchPortals = async () => {
        try {
            const res = await fetch('/api/portals');
            const data = await res.json();
            setPortals(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching portals:', error);
        }
    };

    const fetchWorkspaces = async () => {
        try {
            const res = await fetch('/api/workspaces');
            const data = await res.json();
            setWorkspaces(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching workspaces:', error);
        }
    };

    useEffect(() => {
        const load = async () => {
            await Promise.all([fetchPortals(), fetchWorkspaces()]);
        };
        load();
    }, []);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const res = await fetch('/api/portals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setOpen(false);
                setFormData({ workspace_id: '', slug: '' });
                fetchPortals();
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to create portal');
            }
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this portal? The public link will stop working.')) {
            await fetch(`/api/portals?id=${id}`, { method: 'DELETE' });
            fetchPortals();
        }
    };

    const copyPortalLink = (slug: string, id: number) => {
        const url = `${window.location.origin}/portal/${slug}`;
        navigator.clipboard.writeText(url);
        setCopiedSlug(id);
        setTimeout(() => setCopiedSlug(null), 2000);
    };

    const filteredPortals = portals.filter(p =>
        p.workspace_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        placeholder="Search portals or projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 border-zinc-300 rounded-xl bg-white focus-visible:ring-zinc-900"
                    />
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                        <Button className="h-11 px-6 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold transition-all shadow-sm flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Create Client Portal
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-zinc-900">New Client Portal</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Select Project</Label>
                                <Select
                                    value={formData.workspace_id}
                                    onValueChange={(v) => {
                                        if (!v) return;
                                        const ws = workspaces.find(w => w.id === parseInt(v));
                                        setFormData({
                                            ...formData,
                                            workspace_id: v,
                                            slug: ws ? ws.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 6) : ''
                                        });
                                    }}
                                >
                                    <SelectTrigger className="!h-11 border-zinc-300 rounded-xl">
                                        <SelectValue placeholder="Choose a workspace" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {workspaces.map(ws => (
                                            <SelectItem key={ws.id} value={ws.id.toString()}>{ws.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Portal URL Slug</Label>
                                <div className="flex items-center gap-2">
                                    <div className="h-11 px-3 bg-zinc-50 border border-zinc-300 rounded-xl flex items-center text-xs text-zinc-400 font-medium">
                                        /portal/
                                    </div>
                                    <Input
                                        placeholder="project-slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="h-11 border-zinc-300 rounded-xl focus-visible:ring-zinc-900 font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isCreating || !formData.workspace_id}
                                className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                {isCreating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Generating Portal...
                                    </>
                                ) : (
                                    'Initialize Client Portal'
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPortals.map((portal) => (
                    <div key={portal.id} className="group bg-white rounded-2xl border border-zinc-300 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                        <div className="p-6 flex-1">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => copyPortalLink(portal.slug, portal.id)}
                                        className="w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-900"
                                    >
                                        {copiedSlug === portal.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                    <Link href={`/dashboard/portals/${portal.id}`}>
                                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-900">
                                            <LayoutDashboard className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(portal.id)}
                                        className="w-8 h-8 rounded-lg text-zinc-400 hover:text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-zinc-900 mb-1 truncate">{portal.workspace_name}</h3>
                            <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">/portal/{portal.slug}</p>

                            <div className="flex items-center gap-4 py-3 border-y border-zinc-100 mb-4">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    <Clock className="w-3 h-3" />
                                    {new Date(portal.created_at).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 uppercase tracking-widest">
                                    <Shield className="w-3 h-3" />
                                    {portal.is_active ? 'Active' : 'Private'}
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                            <a
                                href={`/portal/${portal.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-zinc-900 hover:underline flex items-center gap-1"
                            >
                                Open Public View <ExternalLink className="w-3 h-3" />
                            </a>
                            <Link href={`/dashboard/portals/${portal.id}`}>
                                <Button variant="ghost" className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white border border-transparent hover:border-zinc-200">
                                    Manage Content <ArrowRight className="ml-1 w-3 h-3" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}

                {filteredPortals.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
                        <Globe className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-zinc-900 mb-1">No Client Portals Found</h3>
                        <p className="text-sm text-zinc-500 max-w-xs mx-auto">Create your first portal to share project progress and updates with your clients securely.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
