import WorkspacesTab from '@/components/WorkspacesTab';

export default function WorkspacesPage() {
    return (
        <div className="space-y-10 w-full">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Project Workspace</h1>
                <p className="text-zinc-500 text-sm">Manage your client and personal projects with domain and deployment tracking.</p>
            </div>
            <div>
                <WorkspacesTab />
            </div>
        </div>
    );
}
