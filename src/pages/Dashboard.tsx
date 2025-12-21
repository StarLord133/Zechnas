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
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend
} from 'recharts';
import { DollarSign, Activity, FileSpreadsheet, TrendingUp } from "lucide-react";

import { XMLAccountingTable } from "@/components/XMLAccountingTable";
import { TeamManagement } from "@/components/TeamManagement";
import { ClientManagement } from "@/components/ClientManagement";

// --- Mock Data ---
const FINANCIAL_DATA = [
    { name: 'Ene', total: 4000, expenses: 2400 },
    { name: 'Feb', total: 3000, expenses: 1398 },
    { name: 'Mar', total: 5500, expenses: 3800 },
    { name: 'Abr', total: 4800, expenses: 3908 },
    { name: 'May', total: 7000, expenses: 4800 },
    { name: 'Jun', total: 6500, expenses: 3800 },
];

const REVENUE_DISTRIBUTION = [
    { name: 'Consultoría Fiscal', value: 45 },
    { name: 'Auditoría', value: 30 },
    { name: 'Gestión Contable', value: 25 },
];

const GROWTH_DATA = [
    { name: 'Sem 1', active: 12, new: 2 },
    { name: 'Sem 2', active: 15, new: 4 },
    { name: 'Sem 3', active: 18, new: 3 },
    { name: 'Sem 4', active: 25, new: 8 },
];

const COLORS = ['#D4AF37', '#333333', '#666666'];

// --- Components ---

const StatCard = ({ title, value, icon: Icon, trend, trendColor }: any) => (
    <div className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-white/50 text-sm uppercase tracking-wider font-semibold">{title}</p>
                <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className="p-3 bg-[#D4AF37]/10 rounded-lg">
                <Icon className="text-[#D4AF37] w-5 h-5" />
            </div>
        </div>
        {trend && (
            <div className="flex items-center gap-1">
                <TrendingUp className={`w-3 h-3 ${trendColor || 'text-[#D4AF37]'}`} />
                <p className={`${trendColor || 'text-[#D4AF37]'} text-xs font-medium`}>{trend}</p>
            </div>
        )}
    </div>
);

const ViewDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Facturado" value="$84,320" icon={DollarSign} trend="+12.5% vs mes pasado" />
            <StatCard title="Pendiente Cobro" value="$12,450" icon={Activity} trend="2 facturas vencidas" trendColor="text-red-400" />
            <StatCard title="Impuestos (IVA)" value="$13,491" icon={FileSpreadsheet} trend="Vence en 3 días" trendColor="text-blue-400" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Overview (Bar) */}
            <div className="p-6 rounded-lg border border-white/10 bg-[#0a0a0a] h-[400px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white text-base uppercase tracking-widest font-bold">Resumen Financiero</h3>
                    <select className="bg-black border border-white/10 text-xs text-white/60 rounded px-2 py-1">
                        <option>Últimos 6 meses</option>
                        <option>Este Año</option>
                    </select>
                </div>
                <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={FINANCIAL_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}
                            cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                        <Bar dataKey="total" name="Ingresos" fill="#D4AF37" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        <Bar dataKey="expenses" name="Gastos" fill="#333" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Client Growth (Line) */}
            <div className="p-6 rounded-lg border border-white/10 bg-[#0a0a0a] h-[400px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white text-base uppercase tracking-widest font-bold">Crecimiento Cartera</h3>
                    <div className="text-xs text-[#D4AF37]">+8 Clientes Nuevos</div>
                </div>
                <ResponsiveContainer width="100%" height="85%">
                    <LineChart data={GROWTH_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="active" name="Activos" stroke="#D4AF37" strokeWidth={2} dot={{ r: 4, fill: '#D4AF37' }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="new" name="Nuevos" stroke="#666" strokeWidth={2} strokeDasharray="5 5" />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[300px]">
            {/* Revenue Distribution (Pie) */}
            <div className="lg:col-span-1 p-6 rounded-lg border border-white/10 bg-[#0a0a0a]">
                <h3 className="text-white text-base uppercase tracking-widest font-bold mb-4">Ingresos por Servicio</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={REVENUE_DISTRIBUTION}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {REVENUE_DISTRIBUTION.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px', color: '#666' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Quick Actions / Recent Activity (Placeholder) */}
            <div className="lg:col-span-2 p-6 rounded-lg border border-white/10 bg-[#0a0a0a]">
                <h3 className="text-white text-base uppercase tracking-widest font-bold mb-6">Actividad Reciente</h3>
                <div className="space-y-4">
                    {[
                        { action: "Factura F-3920 Aprobada", time: "Hace 10 min", user: "Sistema", type: "success" },
                        { action: "Nuevo Cliente: TechNova", time: "Hace 2 horas", user: "Oswald Zech", type: "info" },
                        { action: "Alerta Fiscal: Declaración Pendiente", time: "Hace 5 horas", user: "SAT API", type: "warning" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${item.type === 'success' ? 'bg-green-500' :
                                    item.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                    }`} />
                                <span className="text-white text-sm font-medium">{item.action}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-white/40">
                                <span>{item.user}</span>
                                <span>{item.time}</span>
                            </div>
                        </div>
                    ))}
                    <div className="pt-4 flex justify-center">
                        <button className="text-[#D4AF37] text-xs uppercase tracking-widest hover:underline">Ver todo el historial</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ViewClients = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <ClientManagement />
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
