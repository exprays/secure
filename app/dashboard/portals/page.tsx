import PortalsTab from '@/components/PortalsTab';

export default function PortalsPage() {
    return (
        <div className="space-y-10 w-full">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Client Portals</h1>
                <p className="text-zinc-500 text-sm">Manage public-facing project dashboards for your clients.</p>
            </div>
            <div>
                <PortalsTab />
            </div>
        </div>
    );
}
