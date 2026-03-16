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
import { XMLAccountingTable } from "@/components/XMLAccountingTable";
import { TeamManagement } from "@/components/TeamManagement";
import { ClientManagement } from "@/components/ClientManagement";
import { useAuth } from "@/hooks/useAuth";

import { AdminDashboard } from "@/components/dashboards/AdminDashboard";
import { EmployeeDashboard } from "@/components/dashboards/EmployeeDashboard";
import { ClientDashboard } from "@/components/dashboards/ClientDashboard";

// --- Components ---

const ViewDashboard = () => {
    const { appUser } = useAuth();

    return (
        <div className="w-full">
            {appUser?.role === 'ADMIN' && <AdminDashboard />}
            {appUser?.role === 'EMPLOYEE' && <EmployeeDashboard />}
            {appUser?.role === 'CLIENT' && <ClientDashboard />}
        </div>
    );
};

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
