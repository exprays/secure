'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Globe, ChevronRight, Search } from 'lucide-react';

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
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                    <Input
                        placeholder="SEARCH VAULT..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-none border-2 border-black pl-12 h-12 font-black uppercase tracking-tighter focus:ring-0 focus:border-black"
                    />
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                        <Button className="bg-black hover:bg-zinc-800 text-white rounded-none font-black uppercase tracking-tighter border-2 border-black h-12 px-8">
                            <Plus className="mr-2 h-5 w-5" /> Add New
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-none border-4 border-black p-8">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">New Credential</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="website_name" className="uppercase text-[10px] font-black tracking-widest ml-1">Website Name</Label>
                                <Input
                                    id="website_name"
                                    value={formData.website_name}
                                    onChange={(e) => setFormData({ ...formData, website_name: e.target.value })}
                                    required
                                    className="rounded-none border-2 border-black focus:ring-0 focus:border-black h-12 font-bold uppercase tracking-tighter"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="url" className="uppercase text-[10px] font-black tracking-widest ml-1">URL</Label>
                                <Input
                                    id="url"
                                    type="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    required
                                    className="rounded-none border-2 border-black focus:ring-0 focus:border-black h-12 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username" className="uppercase text-[10px] font-black tracking-widest ml-1">Username</Label>
                                <Input
                                    id="username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    className="rounded-none border-2 border-black focus:ring-0 focus:border-black h-12 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" title="password" className="uppercase text-[10px] font-black tracking-widest ml-1">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="rounded-none border-2 border-black focus:ring-0 focus:border-black h-12 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes" className="uppercase text-[10px] font-black tracking-widest ml-1">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="rounded-none border-2 border-black focus:ring-0 focus:border-black min-h-[100px] font-bold"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-black hover:bg-zinc-800 text-white rounded-none font-black h-14 uppercase tracking-tighter transition-colors border-2 border-black">Save Credential</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border-2 border-black divide-y-2 divide-black max-h-[calc(100vh-350px)] overflow-y-auto">
                {filteredPasswords.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-xl font-black uppercase tracking-tighter opacity-30">No Credentials Found</p>
                    </div>
                ) : (
                    filteredPasswords.map((pwd) => (
                        <Link key={pwd.id} href={`/dashboard/passwords/${pwd.id}`}>
                            <div className="flex items-center justify-between p-6 hover:bg-black hover:text-white transition-colors group cursor-pointer">
                                <div className="flex items-center space-x-6 overflow-hidden">
                                    <div className="w-12 h-12 border-2 border-black group-hover:border-white flex items-center justify-center shrink-0">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="text-xl font-black uppercase tracking-tighter truncate">{pwd.website_name}</h3>
                                        <p className="text-xs font-bold opacity-50 group-hover:opacity-100 transition-opacity tracking-widest truncate">{pwd.username}</p>
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