'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (data.success) {
            router.push('/dashboard');
            router.refresh();
        } else {
            setError('Invalid username or password');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-zinc-50 text-zinc-900 font-sans">
            <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 items-center justify-center p-12 relative overflow-hidden">
                <div className="max-w-md text-white relative z-10">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight mb-4">Astra Vault</h1>
                    <p className="text-lg text-zinc-400 leading-relaxed">The modern standard for secure credential management and project configuration storage.</p>
                </div>
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-white/[0.02] rounded-full blur-3xl" />
            </div>
            
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 bg-white">
                <div className="w-full max-w-sm space-y-10">
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Astra</h1>
                    </div>
                    
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                        <p className="text-sm text-zinc-500">Enter your administrative credentials to continue.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="rounded-xl border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 h-12 bg-zinc-50/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <Label htmlFor="password" title="password" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="rounded-xl border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 h-12 bg-zinc-50/50"
                                />
                            </div>
                        </div>
                        
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                                <Shield className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}
                        
                        <Button 
                            type="submit" 
                            className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2" 
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : <><Lock className="w-4 h-4" /> Sign In</>}
                        </Button>
                    </form>

                    <p className="text-center text-[10px] text-zinc-400 uppercase tracking-[0.2em]">Protected by Astra End-to-End Encryption</p>
                </div>
            </div>
        </div>
    );
}