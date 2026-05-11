'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
    ArrowLeft, Globe, Rocket, Code, 
    FileText, Calendar, Key, CreditCard,
    ExternalLink, Trash2, Check, Copy,
    Briefcase, User, Clock, Shield, Edit2, Save, X, Plus
} from 'lucide-react';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface Workspace {
    id: number;
    name: string;
    type: string;
    domain: string;
    deployment_url: string;
    repository_url: string;
    invoices: string;
    docs_url: string;
    api_keys: string;
    timeline: string;
    is_deployed: number;
    progress: number;
    dev_status: string;
    created_at: string;
}

export default function WorkspaceDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [workspace, setWorkspace] = useState<Workspace | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isEditingMetadata, setIsEditingMetadata] = useState(false);
    const [metaForm, setMetaForm] = useState({
        invoices: '',
        docs_url: '',
        api_keys: '',
        timeline: ''
    });

    const fetchWorkspace = async () => {
        try {
            const res = await fetch(`/api/workspaces?id=${id}`);
            if (!res.ok) {
                router.push('/dashboard/workspaces');
                return;
            }
            const data = await res.json();
            setWorkspace(data);
        } catch (error) {
            console.error('Error fetching workspace details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkspace();
    }, [id]);

    const updateWorkspace = async (updates: Partial<Workspace>) => {
        setIsUpdating(true);
        try {
            const res = await fetch('/api/workspaces', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updates }),
            });
            if (res.ok) {
                setWorkspace(prev => prev ? { ...prev, ...updates } : null);
            }
        } catch (error) {
            console.error('Error updating workspace:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleMetaSubmit = async () => {
        await updateWorkspace(metaForm);
        setIsEditingMetadata(false);
    };

    useEffect(() => {
        if (workspace) {
            setMetaForm({
                invoices: workspace.invoices || '',
                docs_url: workspace.docs_url || '',
                api_keys: workspace.api_keys || '',
                timeline: workspace.timeline || ''
            });
        }
    }, [workspace]);

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this workspace project?')) {
            await fetch(`/api/workspaces?id=${id}`, { method: 'DELETE' });
            router.push('/dashboard/workspaces');
            router.refresh();
        }
    };

    const copyToClipboard = (text: string, field: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-sm font-medium text-zinc-500 animate-pulse uppercase tracking-widest">Loading Workspace...</p>
            </div>
        );
    }

    if (!workspace) return null;

    const stats = [
        { label: 'Type', value: workspace.type, icon: workspace.type === 'Client' ? Briefcase : User },
        { label: 'Created', value: new Date(workspace.created_at).toLocaleDateString(), icon: Calendar },
        { label: 'Status', value: 'Active', icon: Shield },
    ];

    return (
        <div className="space-y-8 w-full pb-20">
            <div className="flex items-center justify-between">
                <Link href="/dashboard/workspaces">
                    <Button variant="ghost" className="rounded-lg h-10 px-4 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 font-medium text-sm transition-all">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workspaces
                    </Button>
                </Link>
                <Button 
                    onClick={handleDelete}
                    variant="ghost" 
                    className="rounded-lg h-10 px-4 text-white bg-red-600 hover:bg-red-700 font-medium text-sm transition-all"
                >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Project
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Card */}
                    <div className="bg-white rounded-2xl border border-zinc-300 shadow-sm p-8">
                        <div className="flex items-start gap-6">
                            <div className={cn(
                                "w-16 h-16 rounded-2xl border flex items-center justify-center shadow-sm shrink-0",
                                workspace.type === 'Client' ? "bg-zinc-900 border-zinc-900 text-white" : "bg-zinc-50 border-zinc-300 text-zinc-400"
                            )}>
                                {workspace.type === 'Client' ? <Briefcase className="w-8 h-8" /> : <User className="w-8 h-8" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 truncate mb-2">{workspace.name}</h1>
                                <div className="flex flex-wrap gap-4">
                                    {stats.map((stat, i) => (
                                        <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200">
                                            <stat.icon className="w-3 h-3" />
                                            {stat.value}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Status Card */}
                    <div className="bg-white rounded-2xl border border-zinc-300 shadow-sm overflow-hidden">
                        <div className="px-8 py-5 border-b border-zinc-200 bg-zinc-50/30 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Project Progress & Status</h3>
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "w-2 h-2 rounded-full animate-pulse",
                                    workspace.is_deployed ? "bg-green-500" : "bg-zinc-300"
                                )}></div>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    {workspace.is_deployed ? 'Live' : 'Offline'}
                                </span>
                            </div>
                        </div>
                        <div className="p-8 space-y-10">
                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Deployment State</Label>
                                    <div className="flex p-1 bg-zinc-100 rounded-xl w-fit">
                                        <Button 
                                            onClick={() => updateWorkspace({ is_deployed: 1 })}
                                            className={cn(
                                                "h-9 px-4 rounded-lg text-xs font-bold transition-all",
                                                workspace.is_deployed 
                                                    ? "bg-white text-zinc-900 shadow-sm" 
                                                    : "bg-transparent text-zinc-500 hover:text-zinc-700"
                                            )}
                                        >
                                            Deployed
                                        </Button>
                                        <Button 
                                            onClick={() => updateWorkspace({ is_deployed: 0 })}
                                            className={cn(
                                                "h-9 px-4 rounded-lg text-xs font-bold transition-all",
                                                !workspace.is_deployed 
                                                    ? "bg-white text-zinc-900 shadow-sm" 
                                                    : "bg-transparent text-zinc-500 hover:text-zinc-700"
                                            )}
                                        >
                                            Not Deployed
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Development Status</Label>
                                    <Select 
                                        value={workspace.dev_status || 'Planning'} 
                                        onValueChange={(v) => updateWorkspace({ dev_status: v ?? 'Planning' })}
                                    >
                                        <SelectTrigger className="!h-11 w-full border-zinc-300 rounded-xl bg-zinc-50 font-semibold text-zinc-900">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['Planning', 'In Progress', 'On Hold', 'Completed'].map(s => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Completion Progress</Label>
                                    <span className="text-xs font-bold text-zinc-900">{workspace.progress || 0}%</span>
                                </div>
                                <div className="relative h-3 w-full bg-zinc-100 rounded-full overflow-hidden">
                                    <div 
                                        className="absolute top-0 left-0 h-full bg-zinc-900 transition-all duration-500" 
                                        style={{ width: `${workspace.progress || 0}%` }}
                                    />
                                    <input 
                                        type="range" 
                                        min="0" max="100" 
                                        value={workspace.progress || 0}
                                        onChange={(e) => updateWorkspace({ progress: parseInt(e.target.value) })}
                                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Infrastructure Card */}
                    <div className="bg-white rounded-2xl border border-zinc-300 shadow-sm overflow-hidden">
                        <div className="px-8 py-5 border-b border-zinc-200 bg-zinc-50/30">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Infrastructure & Source</h3>
                        </div>
                        <div className="p-8 space-y-8">
                            {[
                                { label: 'Primary Domain', value: workspace.domain, icon: Globe, color: 'text-blue-500' },
                                { label: 'Live Deployment', value: workspace.deployment_url, icon: Rocket, color: 'text-orange-500' },
                                { label: 'Git Repository', value: workspace.repository_url, icon: Code, color: 'text-zinc-900' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-3 group">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.label}</Label>
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-zinc-50 transition-all hover:border-zinc-300">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={cn("w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center shadow-sm", item.color)}>
                                                <item.icon className="w-4 h-4" />
                                            </div>
                                            {item.value ? (
                                                <a href={item.value.startsWith('http') ? item.value : `https://${item.value}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-zinc-900 hover:underline flex items-center gap-2 truncate">
                                                    {item.value} <ExternalLink className="w-3.5 h-3.5 text-zinc-300" />
                                                </a>
                                            ) : (
                                                <span className="text-sm font-medium text-zinc-400 italic">Not configured</span>
                                            )}
                                        </div>
                                        {item.value && (
                                            <Button variant="ghost" onClick={() => copyToClipboard(item.value, item.label)} className="rounded-lg h-9 w-9 p-0 hover:bg-white border border-transparent hover:border-zinc-300">
                                                {copiedField === item.label ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-zinc-400" />}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Business Metadata Card */}
                    <div className="bg-white rounded-2xl border border-zinc-300 shadow-sm overflow-hidden">
                        <div className="px-8 py-5 border-b border-zinc-200 bg-zinc-50/30 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Business Metadata</h3>
                            {!isEditingMetadata ? (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setIsEditingMetadata(true)}
                                    className="h-8 px-3 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-300"
                                >
                                    <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => setIsEditingMetadata(false)}
                                        className="h-8 px-3 rounded-lg text-zinc-500"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        onClick={handleMetaSubmit}
                                        className="h-8 px-3 rounded-lg bg-zinc-900 text-white"
                                    >
                                        <Save className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="p-8 space-y-6">
                            {isEditingMetadata ? (
                                <div className="space-y-6">
                                    {[
                                        { label: 'Invoices', key: 'invoices' },
                                        { label: 'Documentation', key: 'docs_url' },
                                        { label: 'API Secrets', key: 'api_keys' },
                                        { label: 'Timeline', key: 'timeline' },
                                    ].map((field) => (
                                        <div key={field.key} className="space-y-2">
                                            <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{field.label}</Label>
                                            <Input 
                                                value={(metaForm as any)[field.key]}
                                                onChange={(e) => setMetaForm({ ...metaForm, [field.key]: e.target.value })}
                                                className="h-10 rounded-xl border-zinc-300 bg-zinc-50 focus-visible:ring-zinc-900"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                [
                                    { label: 'Invoices', value: workspace.invoices, icon: CreditCard },
                                    { label: 'Documentation', value: workspace.docs_url, icon: FileText },
                                    { label: 'API Secrets', value: workspace.api_keys, icon: Key },
                                    { label: 'Timeline', value: workspace.timeline, icon: Clock },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/30 group">
                                        <div className="w-9 h-9 rounded-lg bg-white border border-zinc-300 flex items-center justify-center shadow-sm shrink-0">
                                            <item.icon className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{item.label}</p>
                                            {item.value ? (
                                                <p className="text-xs font-medium text-zinc-900 break-all">{item.value}</p>
                                            ) : (
                                                <p className="text-[10px] font-medium text-zinc-300 italic uppercase">Optional Field</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Access List */}
                    <div className="bg-white rounded-2xl border border-zinc-300 shadow-sm overflow-hidden">
                        <div className="px-8 py-5 border-b border-zinc-200 bg-zinc-50/30">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Vault Shortcuts</h3>
                        </div>
                        <div className="p-8 space-y-4">
                            <Link href="/dashboard/passwords" className="block">
                                <Button variant="ghost" className="w-full justify-between hover:bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl h-12 px-5 group transition-all">
                                    <span className="flex items-center gap-3 font-semibold">
                                        <Key className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" /> Passwords
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                                </Button>
                            </Link>
                            <Link href="/dashboard/env-files" className="block">
                                <Button variant="ghost" className="w-full justify-between hover:bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl h-12 px-5 group transition-all">
                                    <span className="flex items-center gap-3 font-semibold">
                                        <FileText className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" /> Env Files
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChevronRight({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="m9 18 6-6-6-6"/>
        </svg>
    )
}
