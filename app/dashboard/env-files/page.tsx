import EnvFilesTab from '@/components/EnvFilesTab';

export default function EnvFilesPage() {
    return (
        <div className="space-y-12 max-w-6xl">
            <div>
                <h1 className="text-4xl font-black tracking-tighter text-black uppercase mb-2">Environment Variables</h1>
                <p className="text-black font-medium opacity-50 uppercase tracking-[0.2em] text-sm">Manage your project environments centrally</p>
            </div>
            <div className="bg-white p-8 md:p-12 border-2 border-black">
                <EnvFilesTab />
            </div>
        </div>
    );
}
