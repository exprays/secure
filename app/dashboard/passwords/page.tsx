import PasswordsTab from '@/components/PasswordsTab';

export default function PasswordsPage() {
    return (
        <div className="space-y-10 max-w-7xl">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Password Manager</h1>
                <p className="text-zinc-500 text-sm">Securely store and manage your credentials in your private vault.</p>
            </div>
            <div>
                <PasswordsTab />
            </div>
        </div>
    );
}
