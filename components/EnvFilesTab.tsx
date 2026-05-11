'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, FileText, ChevronRight, Search, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnvFile {
    id: number;
    project_name: string;
    content: string;
    created_at: string;
}

export default function EnvFilesTab() {
    const [envFiles, setEnvFiles] = useState<EnvFile[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        project_name: '',
        content: '',
    });

    const fetchEnvFiles = async () => {
        try {
            const res = await fetch('/api/env-files');
            if (!res.ok) {
                console.error('Failed to fetch env files:', res.statusText);
                return;
            }
            const data = await res.json();
            setEnvFiles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching env files:', error);
        }
    };

    useEffect(() => {
        fetchEnvFiles();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            await fetch('/api/env-files', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            setFormData({ project_name: '', content: '' });
            setOpen(false);
            fetchEnvFiles();
        } finally {
            setIsCreating(false);
        }
    };

    const filteredFiles = envFiles.filter(file => 
        file.project_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input 
                        placeholder="Search projects..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 border-zinc-200 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-zinc-400"
                    />
                </div>
                
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger className="h-11 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm gap-2 flex items-center justify-center transition-colors cursor-pointer">
                        <Plus className="w-4 h-4" /> Add Project
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] w-[95vw] rounded-xl border border-zinc-200 shadow-lg p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Add New Configuration</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="project_name" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Project Name</Label>
                                <Input
                                    id="project_name"
                                    placeholder="e.g. PRODUCTION-API"
                                    value={formData.project_name}
                                    onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                                    className="rounded-lg border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 h-11 font-medium"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Raw .env Content</Label>
                                <Textarea
                                    id="content"
                                    placeholder="KEY=VALUE"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="min-h-[250px] rounded-lg border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 font-mono text-sm break-all resize-none"
                                    required
                                />
                            </div>
                            <Button 
                                type="submit" 
                                disabled={isCreating}
                                className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-bold transition-all shadow-sm mt-2 flex items-center justify-center gap-2"
                            >
                                {isCreating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Saving Configuration...
                                    </>
                                ) : (
                                    'Save Configuration'
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
                <div className="grid grid-cols-[1fr_100px] gap-4 px-6 py-3 bg-zinc-50/50 border-b border-zinc-200 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    <div>Project Name</div>
                    <div className="text-right">Action</div>
                </div>
                {filteredFiles.length === 0 ? (
                    <div className="p-20 text-center">
                        <p className="text-sm font-medium text-zinc-400">No project configurations found.</p>
                    </div>
                ) : (
                    filteredFiles.map((file) => (
                        <Link key={file.id} href={`/dashboard/env-files/${file.id}`}>
                            <div className="grid grid-cols-[1fr_100px] gap-4 px-6 py-4 items-center hover:bg-zinc-50 transition-colors group border-b border-zinc-100 last:border-0">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:border-zinc-300 transition-colors">
                                        <FileText className="w-4 h-4 text-zinc-500" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold text-zinc-900 truncate">{file.project_name}</p>
                                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{new Date(file.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white text-[10px] font-bold transition-all">
                                        Open <ExternalLink className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
