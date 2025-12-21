import { useSearchParams } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Activity, FileSpreadsheet } from "lucide-react";

import { XMLAccountingTable } from "@/components/XMLAccountingTable";
import { TeamManagement } from "@/components/TeamManagement";

// --- Mock Data ---
const FINANCIAL_DATA = [
    { name: 'Ene', total: 4000 },
    { name: 'Feb', total: 3000 },
    { name: 'Mar', total: 5500 },
    { name: 'Abr', total: 4800 },
    { name: 'May', total: 7000 },
    { name: 'Jun', total: 6500 },
];

const CLIENTS_DATA = [
    { id: "CL-001", name: "TechNova Corp", status: "Al día", advisor: "L. Méndez" },
    { id: "CL-002", name: "GreenWare Ltd", status: "Pendiente", advisor: "A. Silva" },
    { id: "CL-003", name: "Solaris Energy", status: "Al día", advisor: "L. Méndez" },
    { id: "CL-004", name: "Apex Logistics", status: "Auditoría", advisor: "R. Castro" },
    { id: "CL-005", name: "Quantum Systems", status: "Al día", advisor: "A. Silva" },
];

// --- Components ---

const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <div className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-white/50 text-sm uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className="p-2 bg-[#D4AF37]/10 rounded-md">
                <Icon className="text-[#D4AF37] w-6 h-6" />
            </div>
        </div>
        {trend && <p className="text-[#D4AF37] text-xs font-medium">{trend}</p>}
    </div>
);

const ViewDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Facturado" value="$84,320" icon={DollarSign} trend="+12.5% vs mes anterior" />
            <StatCard title="Pendiente Cobro" value="$12,450" icon={Activity} trend="2 facturas vencidas" />
            <StatCard title="Impuestos (IVA)" value="$13,491" icon={FileSpreadsheet} trend="Próximo vencimiento: 17 Dic" />
        </div>

        <div className="p-6 rounded-lg border border-white/10 bg-white/5 h-[400px]">
            <h3 className="text-white text-lg font-bold mb-6">Resumen Financiero Semestral</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FINANCIAL_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '4px' }}
                        itemStyle={{ color: '#D4AF37' }}
                        cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
                    />
                    <Bar dataKey="total" fill="#D4AF37" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const ViewClients = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="rounded-md border border-white/10 overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-white/70 font-medium">
                    <tr>
                        <th className="p-4">ID Cliente</th>
                        <th className="p-4">Razón Social</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4">Asesor</th>
                        <th className="p-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {CLIENTS_DATA.map((client) => (
                        <tr key={client.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-white font-mono">{client.id}</td>
                            <td className="p-4 text-white">{client.name}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${client.status === 'Al día' ? 'bg-green-500/20 text-green-400' :
                                    client.status === 'Auditoría' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {client.status}
                                </span>
                            </td>
                            <td className="p-4 text-white/70">{client.advisor}</td>
                            <td className="p-4 text-right">
                                <button className="text-white/50 hover:text-[#D4AF37]">Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);



const ViewBilling = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <XMLAccountingTable />
    </div>
);

const ViewTeam = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <TeamManagement />
    </div>
);


export default function Dashboard() {
    const [searchParams] = useSearchParams();
    const viewParam = searchParams.get('view') || 'dashboard';

    const viewMapping: Record<string, string> = {
        'dashboard': 'Dashboard',
        'clients': 'Clientes',
        'billing': 'Facturación',
        'team': 'Equipo',
        'settings': 'Configuración'
    };

    const currentViewTitle = viewMapping[viewParam] || 'Dashboard';

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-[#000000]">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/5 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-[#191818]">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1 text-[#D4AF37]" />
                        <Separator orientation="vertical" className="mr-2 h-4 bg-white/10" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <span className="text-white/50 text-xs uppercase tracking-widest">Zechnas Panel</span>
                                </BreadcrumbItem>
                                <Separator orientation="vertical" className="mx-2 h-4 bg-white/10" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-[#D4AF37] font-bold">{currentViewTitle}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-6 pt-6">
                    {viewParam === 'dashboard' && <ViewDashboard />}
                    {viewParam === 'clients' && <ViewClients />}
                    {viewParam === 'billing' && <ViewBilling />}
                    {viewParam === 'team' && <ViewTeam />}
                    {(viewParam === 'settings') && (
                        <div className="flex items-center justify-center h-64 border border-dashed border-white/10 rounded-lg text-white/30">
                            Módulo de {currentViewTitle}: En desarrollo
                        </div>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
