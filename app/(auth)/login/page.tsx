'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

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
            setError('Invalid credentials');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white text-black">
            <div className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center p-12">
                <div className="max-w-md text-white">
                    <Shield className="w-24 h-24 mb-8" />
                    <h1 className="text-6xl font-black tracking-tighter mb-4 uppercase">Secure Vault</h1>
                    <p className="text-xl font-medium tracking-widest uppercase opacity-70">The most secure way to manage your project environment variables and passwords.</p>
                </div>
            </div>
            
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
                <div className="w-full max-w-sm space-y-8">
                    <div className="lg:hidden">
                        <Shield className="w-12 h-12 mb-4" />
                        <h1 className="text-4xl font-black tracking-tighter uppercase">Secure Vault</h1>
                    </div>
                    
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold uppercase tracking-tight">Login</h2>
                        <p className="text-sm font-medium opacity-50 uppercase tracking-widest">Enter your credentials to access the vault</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="uppercase text-xs font-bold tracking-widest">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="rounded-none border-2 border-black focus:ring-0 focus:border-black h-12 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" title="password" className="uppercase text-xs font-bold tracking-widest">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="rounded-none border-2 border-black focus:ring-0 focus:border-black h-12 font-bold"
                                />
                            </div>
                        </div>
                        
                        {error && <p className="text-sm font-bold text-black border-2 border-black p-3 uppercase tracking-tighter">{error}</p>}
                        
                        <Button 
                            type="submit" 
                            className="w-full h-14 bg-black hover:bg-zinc-800 text-white rounded-none font-black uppercase tracking-tighter text-lg transition-colors border-2 border-black" 
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : 'Login'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}