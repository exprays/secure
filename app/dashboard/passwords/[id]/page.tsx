'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Eye, EyeOff, Trash2, Globe, ExternalLink, Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface Password {
    id: number;
    website_name: string;
    url: string;
    username: string;
    password: string;
    notes: string;
    created_at: string;
}

export default function PasswordDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [password, setPassword] = useState<Password | null>(null);
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(true);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const fetchPassword = async () => {
        try {
            const res = await fetch(`/api/passwords?id=${id}`);
            if (!res.ok) {
                router.push('/dashboard/passwords');
                return;
            }
            const data = await res.json();
            setPassword(data);
        } catch (error) {
            console.error('Error fetching password details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPassword();
    }, [id]);

    const handleDelete = async () => {
        if (confirm('ARE YOU SURE YOU WANT TO DELETE THIS CREDENTIAL?')) {
            await fetch(`/api/passwords?id=${id}`, { method: 'DELETE' });
            router.push('/dashboard/passwords');
            router.refresh();
        }
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-sm font-medium text-zinc-500 animate-pulse uppercase tracking-widest">Loading Credential...</p>
            </div>
        );
    }

    if (!password) return null;

    return (
        <div className="space-y-8 w-full">
            <div className="flex items-center justify-between">
                <Link href="/dashboard/passwords">
                    <Button variant="ghost" className="rounded-lg h-10 px-4 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 font-medium text-sm transition-all">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Vault
                    </Button>
                </Link>
                <Button 
                    onClick={handleDelete}
                    variant="ghost" 
                    className="rounded-lg h-10 px-4 text-zinc-400 hover:text-red-600 hover:bg-red-50 font-medium text-sm transition-all"
                >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-zinc-100 flex items-center gap-6 bg-zinc-50/30">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                        <Globe className="w-8 h-8 text-zinc-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{password.website_name}</h1>
                        <p className="text-xs text-zinc-400 font-medium mt-1 uppercase tracking-widest">Added on {new Date(password.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="p-8 space-y-10">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Website Address</Label>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-zinc-50 group transition-all hover:border-zinc-200">
                            <a href={password.url} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-zinc-900 hover:underline flex items-center gap-2 truncate">
                                {password.url} <ExternalLink className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                            </a>
                            <Button variant="ghost" onClick={() => copyToClipboard(password.url, 'url')} className="rounded-lg h-9 w-9 p-0 hover:bg-white border border-transparent hover:border-zinc-200">
                                {copiedField === 'url' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-zinc-400" />}
                            </Button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Username</Label>
                            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-zinc-50 group transition-all hover:border-zinc-200">
                                <p className="text-base font-semibold text-zinc-900 truncate">{password.username}</p>
                                <Button variant="ghost" onClick={() => copyToClipboard(password.username, 'username')} className="rounded-lg h-9 w-9 p-0 hover:bg-white border border-transparent hover:border-zinc-200">
                                    {copiedField === 'username' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-zinc-400" />}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Password</Label>
                            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-zinc-50 group transition-all hover:border-zinc-200">
                                <p className="text-base font-mono font-bold tracking-widest text-zinc-900 truncate">
                                    {showPass ? password.password : '••••••••••••'}
                                </p>
                                <div className="flex gap-1">
                                    <Button variant="ghost" onClick={() => setShowPass(!showPass)} className="rounded-lg h-9 w-9 p-0 hover:bg-white border border-transparent hover:border-zinc-200">
                                        {showPass ? <EyeOff className="h-4 w-4 text-zinc-400" /> : <Eye className="h-4 w-4 text-zinc-400" />}
                                    </Button>
                                    <Button variant="ghost" onClick={() => copyToClipboard(password.password, 'password')} className="rounded-lg h-9 w-9 p-0 hover:bg-white border border-transparent hover:border-zinc-200">
                                        {copiedField === 'password' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-zinc-400" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {password.notes && (
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Additional Notes</Label>
                            <div className="p-5 rounded-xl border border-zinc-100 bg-zinc-50">
                                <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">{password.notes}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
