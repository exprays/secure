'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Globe, ChevronRight, Search, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Password {
    id: number;
    website_name: string;
    url: string;
    username: string;
    password: string;
    notes: string;
    created_at: string;
}

export default function PasswordsTab() {
    const [passwords, setPasswords] = useState<Password[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        website_name: '',
        url: '',
        username: '',
        password: '',
        notes: '',
    });

    const fetchPasswords = async () => {
        try {
            const res = await fetch('/api/passwords');
            if (!res.ok) {
                console.error('Failed to fetch passwords:', res.statusText);
                return;
            }
            const data = await res.json();
            setPasswords(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching passwords:', error);
        }
    };

    useEffect(() => {
        fetchPasswords();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/passwords', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        setFormData({ website_name: '', url: '', username: '', password: '', notes: '' });
        setOpen(false);
        fetchPasswords();
    };

    const filteredPasswords = passwords.filter(pwd =>
        pwd.website_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pwd.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        placeholder="Search credentials..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 border-zinc-200 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-zinc-400"
                    />
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger className="h-10 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm gap-2 flex items-center justify-center transition-colors">
                        <Plus className="w-4 h-4" /> Add Credential
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-xl border border-zinc-200 shadow-lg p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">New Credential</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="website_name" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Website Name</Label>
                                <Input
                                    id="website_name"
                                    value={formData.website_name}
                                    onChange={(e) => setFormData({ ...formData, website_name: e.target.value })}
                                    required
                                    className="rounded-lg border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 h-11"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="url" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">URL</Label>
                                    <Input
                                        id="url"
                                        type="url"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        required
                                        className="rounded-lg border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Username</Label>
                                    <Input
                                        id="username"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                        className="rounded-lg border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 h-11"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" title="password" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="rounded-lg border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="rounded-lg border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 min-h-[100px] resize-none"
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-bold transition-all shadow-sm">Save to Vault</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
                <div className="grid grid-cols-[1fr_1fr_100px] gap-4 px-6 py-3 bg-zinc-50/50 border-b border-zinc-200 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    <div>Company</div>
                    <div>Username</div>
                    <div className="text-right">Action</div>
                </div>
                {filteredPasswords.length === 0 ? (
                    <div className="p-20 text-center">
                        <p className="text-sm font-medium text-zinc-400">No credentials found in your vault.</p>
                    </div>
                ) : (
                    filteredPasswords.map((pwd) => (
                        <Link key={pwd.id} href={`/dashboard/passwords/${pwd.id}`}>
                            <div className="grid grid-cols-[1fr_1fr_100px] gap-4 px-6 py-4 items-center hover:bg-zinc-50 transition-colors group border-b border-zinc-100 last:border-0">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:border-zinc-300 transition-colors">
                                        <Globe className="w-4 h-4 text-zinc-500" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold text-zinc-900 truncate">{pwd.website_name}</p>
                                        <p className="text-[10px] text-zinc-400 truncate max-w-[200px]">{pwd.url}</p>
                                    </div>
                                </div>
                                <div className="text-sm font-medium text-zinc-600 truncate">
                                    {pwd.username}
                                </div>
                                <div className="flex justify-end">
                                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white text-[10px] font-bold transition-all">
                                        View <ExternalLink className="w-3 h-3" />
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