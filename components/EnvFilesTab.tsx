'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, FileText, ChevronRight, Search } from 'lucide-react';

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
        await fetch('/api/env-files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        setFormData({ project_name: '', content: '' });
        setOpen(false);
        fetchEnvFiles();
    };

    const filteredFiles = envFiles.filter(file =>
        file.project_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                    <Input
                        placeholder="SEARCH CONFIGS..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-none border-2 border-black pl-12 h-12 font-black uppercase tracking-tighter focus:ring-0 focus:border-black"
                    />
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                        <Button className="bg-black hover:bg-zinc-800 text-white rounded-none font-black uppercase tracking-tighter border-2 border-black h-12 px-8">
                            <Plus className="mr-2 h-5 w-5" /> Add Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-none border-4 border-black p-8 sm:max-w-[700px] w-[95vw]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Add New Configuration</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="project_name" className="uppercase text-[10px] font-black tracking-widest ml-1">Project Name</Label>
                                <Input
                                    id="project_name"
                                    placeholder="e.g. PRODUCTION-API"
                                    value={formData.project_name}
                                    onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                                    className="rounded-none border-2 border-black focus:ring-0 focus:border-black h-12 font-bold uppercase tracking-tighter"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content" className="uppercase text-[10px] font-black tracking-widest ml-1">Raw .env Content</Label>
                                <Textarea
                                    id="content"
                                    placeholder="KEY=VALUE"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="min-h-[250px] rounded-none border-2 border-black focus:ring-0 focus:border-black font-mono text-sm font-bold break-all resize-none"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full bg-black hover:bg-zinc-800 text-white rounded-none font-black h-14 uppercase tracking-tighter transition-colors border-2 border-black">Save Environment</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border-2 border-black divide-y-2 divide-black max-h-[calc(100vh-350px)] overflow-y-auto">
                {filteredFiles.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-xl font-black uppercase tracking-tighter opacity-30">No Configs Found</p>
                    </div>
                ) : (
                    filteredFiles.map((file) => (
                        <Link key={file.id} href={`/dashboard/env-files/${file.id}`}>
                            <div className="flex items-center justify-between p-6 hover:bg-black hover:text-white transition-colors group cursor-pointer">
                                <div className="flex items-center space-x-6 overflow-hidden">
                                    <div className="w-12 h-12 border-2 border-black group-hover:border-white flex items-center justify-center shrink-0">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="text-xl font-black uppercase tracking-tighter truncate">{file.project_name}</h3>
                                        <p className="text-[10px] font-black opacity-30 group-hover:opacity-100 uppercase tracking-widest truncate">
                                            {new Date(file.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-6 h-6 shrink-0" />
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
