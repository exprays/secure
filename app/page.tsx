import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center font-sans">
            <div className="text-center max-w-2xl px-6 flex flex-col items-center">
                <div className="mb-8 p-4 border-2 border-black inline-flex">
                    <Shield className="w-16 h-16 text-black" />
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-black">
                    SECURE VAULT
                </h1>
                
                <p className="text-xl text-black mb-12 leading-relaxed font-medium uppercase tracking-widest">
                    Your personal fortress for managing credentials.
                </p>

                <Link href="/login" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-16 px-12 text-xl bg-black hover:bg-zinc-800 text-white rounded-none border-2 border-black transition-colors font-bold uppercase tracking-tighter">
                        Enter Vault
                    </Button>
                </Link>
            </div>
        </div>
    );
}
