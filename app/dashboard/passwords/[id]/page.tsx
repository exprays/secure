'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Eye, EyeOff, Trash2, Globe, ExternalLink } from 'lucide-react';
import Link from 'next/link';

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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-xl font-black uppercase tracking-tighter animate-pulse">Loading Credential...</p>
            </div>
        );
    }

    if (!password) return null;

    return (
        <div className="space-y-12 max-w-4xl">
            <div className="flex items-center justify-between">
                <Link href="/dashboard/passwords">
                    <Button variant="ghost" className="rounded-none font-black uppercase tracking-tighter hover:bg-black hover:text-white border-2 border-black h-12 px-6 transition-colors">
                        <ArrowLeft className="mr-2 h-5 w-5" /> Back to Vault
                    </Button>
                </Link>
                <Button 
                    onClick={handleDelete}
                    variant="ghost" 
                    className="rounded-none font-black uppercase tracking-tighter hover:bg-red-600 hover:text-white border-2 border-black h-12 px-6 transition-colors"
                >
                    <Trash2 className="mr-2 h-5 w-5" /> Delete
                </Button>
            </div>

            <div className="space-y-6">
                <div className="flex items-center space-x-6 pb-6 border-b-4 border-black">
                    <div className="w-16 h-16 border-4 border-black flex items-center justify-center bg-black text-white shrink-0">
                        <Globe className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter mb-1">{password.website_name}</h1>
                        <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">Stored on {new Date(password.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="grid gap-8 pt-4">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Website Address</p>
                        <div className="flex items-center justify-between p-6 border-2 border-black group">
                            <a href={password.url} target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:underline flex items-center">
                                {password.url} <ExternalLink className="ml-3 w-5 h-5 opacity-30 group-hover:opacity-100" />
                            </a>
                            <Button variant="ghost" onClick={() => copyToClipboard(password.url)} className="rounded-none border-2 border-black h-10 w-10 p-0 hover:bg-black hover:text-white">
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Account Username</p>
                            <div className="flex items-center justify-between p-6 border-2 border-black bg-zinc-50">
                                <p className="text-xl font-black uppercase tracking-tighter truncate">{password.username}</p>
                                <Button variant="ghost" onClick={() => copyToClipboard(password.username)} className="rounded-none border-2 border-black h-10 w-10 p-0 hover:bg-black hover:text-white">
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Account Password</p>
                            <div className="flex items-center justify-between p-6 border-2 border-black bg-zinc-50">
                                <p className="text-xl font-mono font-bold tracking-[0.2em]">
                                    {showPass ? password.password : '••••••••••••'}
                                </p>
                                <div className="flex space-x-2">
                                    <Button variant="ghost" onClick={() => setShowPass(!showPass)} className="rounded-none border-2 border-black h-10 w-10 p-0 hover:bg-black hover:text-white">
                                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <Button variant="ghost" onClick={() => copyToClipboard(password.password)} className="rounded-none border-2 border-black h-10 w-10 p-0 hover:bg-black hover:text-white">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {password.notes && (
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Additional Notes</p>
                            <div className="p-4 border-2 border-black bg-zinc-50 max-h-[120px] overflow-y-auto">
                                <p className="text-sm font-medium leading-relaxed uppercase tracking-tight whitespace-pre-wrap">{password.notes}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
