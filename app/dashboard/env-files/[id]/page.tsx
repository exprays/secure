'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Trash2, FileText, Eye, EyeOff, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface EnvFile {
    id: number;
    project_name: string;
    content: string;
    created_at: string;
}

interface EnvPair {
    key: string;
    value: string;
}

export default function EnvFileDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [file, setFile] = useState<EnvFile | null>(null);
    const [showValues, setShowValues] = useState(false);
    const [loading, setLoading] = useState(true);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const fetchEnvFile = async () => {
        try {
            const res = await fetch(`/api/env-files?id=${id}`);
            if (!res.ok) {
                router.push('/dashboard/env-files');
                return;
            }
            const data = await res.json();
            setFile(data);
        } catch (error) {
            console.error('Error fetching env file details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnvFile();
    }, [id]);

    const handleDelete = async () => {
        if (confirm('ARE YOU SURE YOU WANT TO DELETE THIS CONFIGURATION?')) {
            await fetch(`/api/env-files?id=${id}`, { method: 'DELETE' });
            router.push('/dashboard/env-files');
            router.refresh();
        }
    };

    const handleDownload = () => {
        if (!file) return;
        const blob = new Blob([file.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `.env.${file.project_name.toLowerCase().replace(/\s+/g, '-')}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const parseEnv = (content: string): EnvPair[] => {
        return content
            .split('\n')
            .filter(line => line.trim() !== '' && !line.trim().startsWith('#'))
            .map(line => {
                const index = line.indexOf('=');
                if (index === -1) return { key: line.trim(), value: '' };
                return {
                    key: line.substring(0, index).trim(),
                    value: line.substring(index + 1).trim().replace(/^["']|["']$/g, ''),
                };
            });
    };

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-sm font-medium text-zinc-500 animate-pulse uppercase tracking-widest">Loading Configuration...</p>
            </div>
        );
    }

    if (!file) return null;

    const pairs = parseEnv(file.content);

    return (
        <div className="space-y-8 max-w-5xl">
            <div className="flex items-center justify-between">
                <Link href="/dashboard/env-files">
                    <Button variant="ghost" className="rounded-lg h-10 px-4 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 font-medium text-sm transition-all">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Configs
                    </Button>
                </Link>
                <div className="flex space-x-3">
                    <Button 
                        onClick={handleDownload}
                        variant="ghost" 
                        className="rounded-lg h-10 px-4 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 font-medium text-sm transition-all border border-zinc-200"
                    >
                        <Download className="mr-2 h-4 w-4" /> Download .env
                    </Button>
                    <Button 
                        onClick={handleDelete}
                        variant="ghost" 
                        className="rounded-lg h-10 px-4 text-zinc-400 hover:text-red-600 hover:bg-red-50 font-medium text-sm transition-all"
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-zinc-100 flex items-center gap-6 bg-zinc-50/30">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                        <FileText className="w-8 h-8 text-zinc-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{file.project_name}</h1>
                        <p className="text-xs text-zinc-400 font-medium mt-1 uppercase tracking-widest">{pairs.length} variables • Added on {new Date(file.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Environment Variables</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowValues(!showValues)}
                            className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 h-8 px-4 rounded-lg border border-zinc-100"
                        >
                            {showValues ? <><EyeOff className="mr-2 h-3.5 w-3.5" /> Hide Values</> : <><Eye className="mr-2 h-3.5 w-3.5" /> Show Values</>}
                        </Button>
                    </div>

                    <div className="rounded-xl border border-zinc-200 overflow-hidden overflow-y-auto max-h-[calc(100vh-450px)] shadow-sm">
                        <div className="grid grid-cols-[1fr_1fr_60px] gap-4 px-6 py-3 bg-zinc-50/50 border-b border-zinc-200 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                            <div>Key</div>
                            <div>Value</div>
                            <div className="text-right">Copy</div>
                        </div>
                        {pairs.map((pair, idx) => (
                            <div key={idx} className="grid grid-cols-[1fr_1fr_60px] gap-4 px-6 py-4 items-center hover:bg-zinc-50 transition-colors group border-b border-zinc-100 last:border-0">
                                <div className="font-mono text-xs font-bold text-zinc-900 truncate pr-4">
                                    {pair.key}
                                </div>
                                <div className="font-mono text-xs text-zinc-600 truncate overflow-hidden">
                                    <span className={cn(
                                        "transition-all block truncate break-all",
                                        !showValues && "blur-[6px] select-none opacity-30"
                                    )}>
                                        {pair.value || 'EMPTY'}
                                    </span>
                                </div>
                                <div className="flex justify-end">
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => copyToClipboard(pair.value, pair.key)}
                                        className="h-8 w-8 p-0 rounded-lg hover:bg-white border border-transparent hover:border-zinc-200 transition-all"
                                    >
                                        {copiedKey === pair.key ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-zinc-400" />}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
