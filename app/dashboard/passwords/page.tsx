import PasswordsTab from '@/components/PasswordsTab';

export default function PasswordsPage() {
    return (
        <div className="space-y-12 max-w-6xl">
            <div>
                <h1 className="text-4xl font-black tracking-tighter text-black uppercase mb-2">Password Manager</h1>
                <p className="text-black font-medium opacity-50 uppercase tracking-[0.2em] text-sm">Securely store and manage your credentials</p>
            </div>
            <div className="bg-white p-8 md:p-12 border-2 border-black">
                <PasswordsTab />
            </div>
        </div>
    );
}
