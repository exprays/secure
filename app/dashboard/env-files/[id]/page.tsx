'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Trash2, FileText, Eye, EyeOff, Copy } from 'lucide-react';
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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-xl font-black uppercase tracking-tighter animate-pulse">Loading Configuration...</p>
            </div>
        );
    }

    if (!file) return null;

    const pairs = parseEnv(file.content);

    return (
        <div className="space-y-12 max-w-5xl">
            <div className="flex items-center justify-between">
                <Link href="/dashboard/env-files">
                    <Button variant="ghost" className="rounded-none font-black uppercase tracking-tighter hover:bg-black hover:text-white border-2 border-black h-12 px-6 transition-colors">
                        <ArrowLeft className="mr-2 h-5 w-5" /> Back to Configs
                    </Button>
                </Link>
                <div className="flex space-x-4">
                    <Button 
                        onClick={handleDownload}
                        variant="ghost" 
                        className="rounded-none font-black uppercase tracking-tighter hover:bg-black hover:text-white border-2 border-black h-12 px-6 transition-colors"
                    >
                        <Download className="mr-2 h-5 w-5" /> Download .env
                    </Button>
                    <Button 
                        onClick={handleDelete}
                        variant="ghost" 
                        className="rounded-none font-black uppercase tracking-tighter hover:bg-red-600 hover:text-white border-2 border-black h-12 px-6 transition-colors"
                    >
                        <Trash2 className="mr-2 h-5 w-5" /> Delete
                    </Button>
                </div>
            </div>

            <div className="space-y-8">
                <div className="flex items-center space-x-6 pb-6 border-b-4 border-black">
                    <div className="w-16 h-16 border-4 border-black flex items-center justify-center bg-black text-white shrink-0">
                        <FileText className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter mb-1">{file.project_name}</h1>
                        <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">{pairs.length} variables • Stored on {new Date(file.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Key-Value Pairs</p>
                        <Button
                            variant="ghost"
                            onClick={() => setShowValues(!showValues)}
                            className="text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white rounded-none border-2 border-black h-10 px-6 transition-colors"
                        >
                            {showValues ? <><EyeOff className="mr-2 h-4 w-4" /> Hide Values</> : <><Eye className="mr-2 h-4 w-4" /> Show Values</>}
                        </Button>
                    </div>

                    <div className="border-2 border-black divide-y-2 divide-black max-h-[calc(100vh-400px)] overflow-y-auto">
                        {pairs.map((pair, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row md:items-center py-6 px-8 hover:bg-zinc-50 transition-colors group">
                                <div className="w-full md:w-1/3 font-mono text-sm font-black uppercase tracking-widest py-1 truncate pr-4">
                                    {pair.key}
                                </div>
                                <div className="flex-1 font-mono text-sm font-bold py-1 flex items-center justify-between overflow-hidden">
                                    <span className={cn(
                                        "transition-all block truncate break-all",
                                        !showValues && "blur-[8px] select-none opacity-20"
                                    )}>
                                        {pair.value || 'EMPTY_VALUE'}
                                    </span>
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => copyToClipboard(pair.value)}
                                        className="rounded-none border-2 border-black h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white transition-all ml-4 shrink-0"
                                    >
                                        <Copy className="h-3 w-3" />
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
