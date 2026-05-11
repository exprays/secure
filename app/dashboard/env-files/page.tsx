import EnvFilesTab from '@/components/EnvFilesTab';

export default function EnvFilesPage() {
    return (
        <div className="space-y-10 max-w-7xl">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Environment Variables</h1>
                <p className="text-zinc-500 text-sm">Manage your project environments centrally and securely.</p>
            </div>
            <div>
                <EnvFilesTab />
            </div>
        </div>
    );
}
