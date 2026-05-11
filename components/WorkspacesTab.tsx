'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Search, Plus, Briefcase, User, Globe,
    Rocket, Code, ExternalLink, ChevronRight,
    Filter
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

interface Workspace {
    id: number;
    name: string;
    type: string;
    domain: string;
    deployment_url: string;
    repository_url: string;
    created_at: string;
}

export default function WorkspacesTab() {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<'All' | 'Client' | 'Personal'>('All');
    const [open, setOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState<{
        name: string;
        type: string;
        domain: string;
        deployment_url: string;
        repository_url: string;
        invoices: string;
        docs_url: string;
        api_keys: string;
        timeline: string;
    }>({
        name: '',
        type: 'Client',
        domain: '',
        deployment_url: '',
        repository_url: '',
        invoices: '',
        docs_url: '',
        api_keys: '',
        timeline: ''
    });

    const fetchWorkspaces = async () => {
        const res = await fetch('/api/workspaces');
        const data = await res.json();
        if (Array.isArray(data)) setWorkspaces(data);
    };

    useEffect(() => {
        const load = async () => {
            await fetchWorkspaces();
        };
        load();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const res = await fetch('/api/workspaces', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setOpen(false);
                setFormData({
                    name: '',
                    type: 'Client',
                    domain: '',
                    deployment_url: '',
                    repository_url: '',
                    invoices: '',
                    docs_url: '',
                    api_keys: '',
                    timeline: ''
                });
                fetchWorkspaces();
            }
        } finally {
            setIsCreating(false);
        }
    };

    const filteredWorkspaces = workspaces.filter(ws => {
        const matchesSearch = ws.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'All' || ws.type === typeFilter;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-3 max-w-2xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-11 border-zinc-200 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-zinc-400"
                        />
                    </div>
                    <Select value={typeFilter} onValueChange={(v) => v && setTypeFilter(v as any)}>
                        <SelectTrigger className="w-[140px] !h-11 border-zinc-200 rounded-lg text-sm">
                            <Filter className="w-3.5 h-3.5 mr-2 text-zinc-400" />
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Projects</SelectItem>
                            <SelectItem value="Client">Client</SelectItem>
                            <SelectItem value="Personal">Personal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger className="h-10 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm gap-2 flex items-center justify-center transition-colors shrink-0 cursor-pointer">
                        <Plus className="w-4 h-4" /> Add Project
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] w-[95vw] rounded-xl border border-zinc-200 shadow-lg p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">New Workspace Project</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Project Name</Label>
                                    <Input
                                        placeholder="e.g. Acme Dashboard"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="rounded-lg border-zinc-200 h-11"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Type</Label>
                                    <Select value={formData.type} onValueChange={(v) => v && setFormData({ ...formData, type: v as any })}>
                                        <SelectTrigger className="!h-11 w-full border-zinc-200 rounded-lg">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Client">Client Project</SelectItem>
                                            <SelectItem value="Personal">Personal Project</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Repository URL</Label>
                                    <Input
                                        placeholder="https://github.com/..."
                                        value={formData.repository_url}
                                        onChange={(e) => setFormData({ ...formData, repository_url: e.target.value })}
                                        className="rounded-lg border-zinc-200 h-11"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Domain</Label>
                                        <Input
                                            placeholder="acme.com"
                                            value={formData.domain}
                                            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                            className="rounded-lg border-zinc-200 h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Deployment</Label>
                                        <Input
                                            placeholder="vercel.app/..."
                                            value={formData.deployment_url}
                                            onChange={(e) => setFormData({ ...formData, deployment_url: e.target.value })}
                                            className="rounded-lg border-zinc-200 h-11"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={isCreating}
                                className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-bold transition-all shadow-sm mt-2 flex items-center justify-center gap-2"
                            >
                                {isCreating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Creating Workspace...
                                    </>
                                ) : (
                                    'Create Workspace'
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar pr-1">
                <div className="grid grid-cols-[1fr_120px_120px_60px] gap-4 px-6 py-3 bg-zinc-50/50 border border-zinc-200 rounded-t-xl text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    <div>Project</div>
                    <div>Type</div>
                    <div>Status</div>
                    <div className="text-right pr-2">Link</div>
                </div>
                <div className="border-x border-b border-zinc-200 rounded-b-xl overflow-hidden bg-white">
                    {filteredWorkspaces.length === 0 ? (
                        <div className="p-20 text-center">
                            <p className="text-sm font-medium text-zinc-400">No projects found in this workspace.</p>
                        </div>
                    ) : (
                        filteredWorkspaces.map((ws) => (
                            <Link key={ws.id} href={`/dashboard/workspaces/${ws.id}`}>
                                <div className="grid grid-cols-[1fr_120px_120px_60px] gap-4 px-6 py-4 items-center hover:bg-zinc-50 transition-colors group border-b border-zinc-100 last:border-0">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={cn(
                                            "w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-all",
                                            ws.type === 'Client'
                                                ? "bg-zinc-900 border-zinc-900 text-white"
                                                : "bg-white border-zinc-200 text-zinc-500 group-hover:border-zinc-900 group-hover:text-zinc-900"
                                        )}>
                                            {ws.type === 'Client' ? <Briefcase className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-semibold text-zinc-900 truncate">{ws.name}</p>
                                            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{ws.domain || 'No Domain'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={cn(
                                            "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                            ws.type === 'Client' ? "bg-zinc-100 text-zinc-900" : "bg-zinc-50 text-zinc-500"
                                        )}>
                                            {ws.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active</span>
                                    </div>
                                    <div className="flex justify-end pr-2">
                                        <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
