import { useState, useMemo, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import {
    Users,
    UserPlus,
    Search,
    Filter,
    ArrowLeft,
    Building2,
    TrendingUp,
    AlertCircle,
    DollarSign,
    FileText,
    Copy,
    CheckCircle2,
    XCircle,
    Trash2,
    MoreHorizontal
} from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Pie,
    PieChart as RePieChart,
    LineChart,
    Line
} from 'recharts';

// --- Types ---
type ClientStatus = "Activo" | "Inactivo" | "Pendiente" | "Auditoría"
type Industry = "Tecnología" | "Salud" | "Finanzas" | "Manufactura" | "Retail" | "Energía"

interface Client {
    id: string
    full_uid: string
    name: string
    industry: Industry
    status: ClientStatus
    contactName: string
    email: string
    phone: string
    location: string
    annualValue: number
    joinDate: string
    projectsCount: number
}

// --- Initial State ---
const INITIAL_CLIENTS: Client[] = [];

// --- Helper Functions ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value)
}

const getStatusColor = (status: ClientStatus) => {
    switch (status) {
        case "Activo": return "text-green-400 bg-green-400/10 border-green-400/20"
        case "Pendiente": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
        case "Inactivo": return "text-red-400 bg-red-400/10 border-red-400/20"
        case "Auditoría": return "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20"
        default: return "text-white/50 bg-white/5 border-white/10"
    }
}

// --- Components ---

function ClientProfile({ client, onBack }: { client: Client, onBack: () => void }) {
    // Mock Chart Data for individual client
    const projectHistory = [
        { month: 'Ene', value: 45000 },
        { month: 'Feb', value: 52000 },
        { month: 'Mar', value: 48000 },
        { month: 'Abr', value: 61000 },
        { month: 'May', value: 55000 },
        { month: 'Jun', value: 67000 },
    ]

    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);

    const handleGenerateLink = async () => {
        setIsGeneratingLink(true);
        setGeneratedLink(null);
        try {
            const generateFn = httpsCallable<{email: string}, {link: string}>(cloudFunctions, 'generateResetLink');
            const res = await generateFn({ email: client.email });
            setGeneratedLink(res.data.link);
        } catch (e: any) {
             console.error(e);
             alert("Error al generar el link: " + e.message);
        } finally {
            setIsGeneratingLink(false);
        }
    };

    return (
        <div className="space-y-6 w-full animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center justify-between">
                <Button 
                    variant="ghost" 
                    onClick={() => {
                        setGeneratedLink(null);
                        onBack();
                    }} 
                    className="text-white/60 hover:text-[#D4AF37] hover:bg-white/5 pl-0 gap-2"
                >
                    <ArrowLeft className="w-5 h-5" /> Volver al listado
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-white/10 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]">
                        <FileText className="w-4 h-4 mr-2" /> Reporte Fiscal
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-[#D4AF37] text-black hover:bg-[#b5952f]">
                                Editar Cliente
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0f0f0f] border-white/10 text-white sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Editar Razón Social</DialogTitle>
                                <DialogDescription className="text-white/40">Modifica los detalles corporativos base.</DialogDescription>
                            </DialogHeader>
                            <form 
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const name = formData.get("name") as string;
                                    const industry = formData.get("industry") as string;
                                    try {
                                        const editFn = httpsCallable<any, any>(cloudFunctions, 'editUserProfile');
                                        await editFn({ uid: client.full_uid, name, department: industry });
                                        alert("Razón Social / Industria modificada correctamente.");
                                    } catch (err: any) {
                                        console.error(err);
                                        alert("No se pudo modificar: " + err.message);
                                    }
                                }} 
                                className="space-y-4 py-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-white/60">Razón Social</label>
                                    <Input name="name" defaultValue={client.name} className="bg-black border-white/10 focus-visible:ring-[#D4AF37]" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-white/60">Industria</label>
                                    <Input name="industry" defaultValue={client.industry} className="bg-black border-white/10 focus-visible:ring-[#D4AF37]" required />
                                </div>
                                <DialogFooter className="mt-6">
                                    <Button type="submit" className="bg-[#D4AF37] text-black hover:bg-[#b5952f]">Guardar Detalles</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-[#1f1f1f] to-[#000] border border-white/10 flex items-center justify-center text-2xl font-bold text-[#D4AF37]">
                                {client.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{client.name}</h2>
                                <div className="flex gap-2 mt-1">
                                    <Badge variant="outline" className="border-white/10 text-white/60">{client.industry}</Badge>
                                    <Badge variant="outline" className={getStatusColor(client.status)}>{client.status}</Badge>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white/40 text-xs uppercase tracking-wider">Valor Anual</p>
                            <p className="text-2xl font-bold text-[#D4AF37]">{formatCurrency(client.annualValue)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-white/10 mb-6">
                        <div>
                            <p className="text-white/40 text-xs uppercase mb-1">Contacto Principal</p>
                            <p className="text-white font-medium">{client.contactName}</p>
                        </div>
                        <div>
                            <p className="text-white/40 text-xs uppercase mb-1">Email</p>
                            <p className="text-white font-medium text-sm truncate" title={client.email}>{client.email}</p>
                        </div>
                        <div>
                            <p className="text-white/40 text-xs uppercase mb-1">Teléfono</p>
                            <p className="text-white font-medium text-sm">{client.phone}</p>
                        </div>
                        <div>
                            <p className="text-white/40 text-xs uppercase mb-1">Ubicación</p>
                            <p className="text-white font-medium text-sm">{client.location}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Evolución de Facturación (Semestral)</h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={projectHistory}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}
                                        cursor={{ stroke: '#D4AF37', strokeWidth: 1 }}
                                    />
                                    <Line type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={2} dot={{ fill: '#D4AF37', r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-[#0f0f0f] border border-white/10 p-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-[#D4AF37]" /> Detalles Corporativos
                        </h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-white/50">ID Cliente</span>
                                <span className="text-white font-mono">{client.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">RFC</span>
                                <span className="text-white font-mono">XAXX010101000</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">Fecha de Alta</span>
                                <span className="text-white">{client.joinDate}</span>
                            </div>
                            <Separator className="bg-white/10" />
                            <div className="flex justify-between items-center">
                                <span className="text-white/50">Proyectos Activos</span>
                                <Badge className="bg-white/10 text-white hover:bg-white/20">{client.projectsCount}</Badge>
                            </div>

                            {/* Panel especial sólo si el cliente es "Pendiente" */}
                            {client.status === 'Pendiente' && (
                                <>
                                    <Separator className="bg-white/10" />
                                    <div className="pt-2">
                                        <p className="text-xs text-white/40 mb-3">El cliente no ha establecido su contraseña. Puedes re-generar el enlace de invitación.</p>
                                        {!generatedLink ? (
                                            <Button 
                                                variant="outline" 
                                                className="w-full border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 flex items-center gap-2"
                                                onClick={handleGenerateLink}
                                                disabled={isGeneratingLink}
                                            >
                                                {isGeneratingLink ? 'Generando...' : 'Re-Generar Enlace de Acceso'}
                                            </Button>
                                        ) : (
                                            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 p-3 rounded-md space-y-3">
                                                 <p className="text-xs text-[#D4AF37] font-medium flex items-center gap-1">
                                                     <CheckCircle2 className="w-3 h-3" /> Enlace Generado
                                                 </p>
                                                 <div className="relative">
                                                    <Input
                                                        readOnly
                                                        value={generatedLink}
                                                        className="bg-black border-[#D4AF37]/30 text-[10px] pr-10 h-8 font-mono text-[#D4AF37]"
                                                    />
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="absolute right-0 top-0 h-8 w-8 text-[#D4AF37] hover:bg-transparent hover:text-white"
                                                        onClick={() => navigator.clipboard.writeText(generatedLink)}
                                                        title="Copiar Enlace"
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>

                    <Card className="bg-[#0f0f0f] border border-white/10 p-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-400" /> Alertas
                        </h3>
                        <div className="bg-red-500/10 border border-red-500/20 rounded p-3 text-xs text-red-200 mb-2">
                            Declaración anual próxima a vencer (15 días).
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3 text-xs text-yellow-200">
                            Actualización de expediente pendiente.
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

// Zod Schema for Client
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { httpsCallable } from "firebase/functions";
import { db, cloudFunctions } from "../lib/firebase/config";
import { doc, updateDoc, collection, query, where, onSnapshot } from "firebase/firestore";

const ClientSchema = z.object({
    name: z.string().min(2, "Razón Social es requerida"),
    rfc: z.string().min(12, "RFC Inválido").max(13, "RFC Inválido"),
    industry: z.enum(["Tecnología", "Finanzas", "Salud"]),
    contactName: z.string().min(2, "Contacto Principal requerido"),
    email: z.string().email("Correo de acceso requerido para Firebase Auth")
});

type ClientFormType = z.infer<typeof ClientSchema>;

export function ClientManagement() {
    const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const { appUser, firebaseUser } = useAuth()

    useEffect(() => {
        if (!firebaseUser) return;
        
        let q = query(collection(db, "users"), where("role", "==", "CLIENT"));
        if (appUser?.role === "EMPLOYEE") {
            q = query(collection(db, "users"), where("role", "==", "CLIENT"), where("employee_id", "==", firebaseUser.uid));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedClients: Client[] = [];
            snapshot.forEach((docSnap) => {
                const data = docSnap.data();

                let parsedDate = "Reciente";
                if (data.createdAt) {
                    if (data.createdAt.seconds) {
                        parsedDate = new Date(data.createdAt.seconds * 1000).toLocaleDateString('es-MX');
                    } else if (typeof data.createdAt === 'string') {
                        parsedDate = new Date(data.createdAt).toLocaleDateString('es-MX');
                    }
                }

                // Parse Status correctly avoiding visual bugs
                let safeStatus: ClientStatus = "Pendiente";
                if (data.disabled) safeStatus = "Inactivo";
                else if (data.status) safeStatus = data.status as ClientStatus;

                fetchedClients.push({
                    id: docSnap.id.substring(0, 8).toUpperCase(),
                    full_uid: docSnap.id, // we injection the true uid to manage identities
                    name: data.name || "Sin Razón Social",
                    industry: data.industry || "Tecnología",
                    status: safeStatus,
                    contactName: data.contactName || "Sin contacto",
                    email: data.email || "Sin email",
                    phone: data.phone || "No registrado",
                    location: data.location || "Remoto",
                    annualValue: data.annualValue || 0,
                    joinDate: parsedDate,
                    projectsCount: data.projectsCount || 0
                });
            });
            setClients(fetchedClients);
        }, (error) => {
            console.error("Error fetching clients realtime:", error);
        });

        return () => unsubscribe();
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitResult, setSubmitResult] = useState<{ type: 'success' | 'error', msg: string, link?: string } | null>(null)

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ClientFormType>({
        resolver: zodResolver(ClientSchema)
    });

    const onSubmit = async (data: ClientFormType) => {
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const inviteUserCommand = httpsCallable<{ email: string, role: string, client_type: string }, { resetLink: string, uid: string }>(cloudFunctions, "inviteUser");

            // 1. Inyectamos en Auth
            const response = await inviteUserCommand({
                email: data.email,
                role: "CLIENT",
                client_type: data.rfc.length === 12 ? "BUSINESS" : "INDIVIDUAL"
            });

            const newUid = response.data.uid;

            // 2. Inyectamos Metadatos de Negocio
            await updateDoc(doc(db, "users", newUid), {
                name: data.name,
                rfc: data.rfc,
                industry: data.industry,
                contactName: data.contactName,
                status: "Pendiente"
            });

            setSubmitResult({
                type: 'success',
                msg: `El Cliente (${data.name}) ha sido inyectado en Vault con éxito.`,
                link: response.data.resetLink
            });
            reset();



        } catch (error: any) {
            console.error(error);
            setSubmitResult({ type: 'error', msg: "Rechazado: " + error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Derived Metrics
    const metrics = useMemo(() => {
        const totalClients = clients.length
        const totalValue = clients.reduce((acc, curr) => acc + curr.annualValue, 0)
        const activeClients = clients.filter(c => c.status === "Activo").length
        const auditClients = clients.filter(c => c.status === "Auditoría").length

        // Industry Distribution for Pie Chart
        const industryCounts: Record<string, number> = {}
        clients.forEach(c => {
            industryCounts[c.industry] = (industryCounts[c.industry] || 0) + 1
        })
        const industryData = Object.keys(industryCounts).map(key => ({
            name: key,
            value: industryCounts[key]
        }))

        return { totalClients, totalValue, activeClients, auditClients, industryData }
    }, [clients])

    // Filter Logic
    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.industry.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Chart Colors
    const COLORS = ['#D4AF37', '#ffffff', '#333333', '#666666', '#999999', '#191818'];

    if (selectedClient) {
        return <ClientProfile client={selectedClient} onBack={() => setSelectedClient(null)} />
    }

    return (
        <div className="space-y-6 w-full animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Cartera de Clientes</h2>
                    <p className="text-white/40 text-sm">Gestión integral, KPIs y análisis de rendimiento.</p>
                </div>
                {appUser?.role !== 'EMPLOYEE' && (
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#D4AF37] text-black hover:bg-[#b5952f] font-bold">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Nuevo Cliente
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0f0f0f] border-white/10 text-white sm:max-w-xl">
                            <DialogHeader>
                                <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
                                <DialogDescription className="text-white/40">Ingrese los datos fiscales y de contacto para crear la cuenta y Vault criptográfico del cliente.</DialogDescription>
                            </DialogHeader>

                            {submitResult?.type === 'success' ? (
                                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] p-4 rounded-lg text-sm mb-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                                        <p className="font-bold">{submitResult.msg}</p>
                                    </div>
                                    <div className="bg-black/50 border border-[#D4AF37]/20 rounded-md p-3 relative group">
                                        <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]/70 font-bold mb-1">Enlace de Activación Criptográfico</p>
                                        <div className="flex gap-2 items-center">
                                           <input 
                                               readOnly 
                                               value={submitResult.link}
                                               className="bg-transparent border-none text-white/90 text-xs w-full focus:outline-none focus:ring-0 truncate font-mono"
                                           />
                                           <button 
                                               onClick={(e) => {
                                                   e.preventDefault();
                                                   navigator.clipboard.writeText(submitResult.link || "");
                                               }}
                                               className="p-2 border border-[#D4AF37]/30 bg-[#D4AF37]/10 rounded hover:bg-[#D4AF37]/20 hover:text-white text-[#D4AF37] transition-colors flex-shrink-0"
                                               title="Copiar Enlace"
                                           >
                                                <Copy className="w-4 h-4" />
                                           </button>
                                        </div>
                                        <p className="text-[9px] text-[#D4AF37]/50 mt-2">Cópialo y envíaselo al cliente por un canal seguro para que establezca su bóveda.</p>
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <Button type="button" onClick={() => setIsAddDialogOpen(false)} className="bg-[#D4AF37] text-black hover:bg-[#b5952f] font-bold">Cerrar</Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {submitResult?.type === 'error' && (
                                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg text-sm mb-4">
                                            {submitResult.msg}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-white/50">Razón Social</label>
                                                <Input {...register("name")} className="bg-black border-white/10 focus-visible:ring-[#D4AF37]" placeholder="Nombre de la empresa" />
                                                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-white/50">RFC</label>
                                                <Input {...register("rfc")} className="bg-black border-white/10 focus-visible:ring-[#D4AF37]" placeholder="XAXX010101000" />
                                                {errors.rfc && <p className="text-red-500 text-xs">{errors.rfc.message}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-white/50">Correo Electrónico (Para Acceso)</label>
                                                <Input {...register("email")} type="email" className="bg-black border-white/10 focus-visible:ring-[#D4AF37]" placeholder="admin@empresa.com" />
                                                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-white/50">Industria</label>
                                                <select {...register("industry")} className="flex h-9 w-full rounded-md border border-white/10 bg-black px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]">
                                                    <option value="Tecnología">Tecnología</option>
                                                    <option value="Finanzas">Finanzas</option>
                                                    <option value="Salud">Salud</option>
                                                </select>
                                                {errors.industry && <p className="text-red-500 text-xs">{errors.industry.message}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-white/50">Contacto Principal (Nombre)</label>
                                            <Input {...register("contactName")} className="bg-black border-white/10 focus-visible:ring-[#D4AF37]" placeholder="Nombre completo" />
                                            {errors.contactName && <p className="text-red-500 text-xs">{errors.contactName.message}</p>}
                                        </div>

                                        <DialogFooter className="mt-4">
                                            <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="text-white hover:text-[#D4AF37]">Cerrar</Button>
                                            <Button type="submit" disabled={isSubmitting} className="bg-[#D4AF37] text-black hover:bg-[#b5952f] disabled:opacity-50">
                                                {isSubmitting ? "Ejecutando..." : "Crear Identidad y Vault"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-[#0a0a0a] to-black border border-white/10">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-white/40 text-xs uppercase font-bold tracking-wider">Total Clientes</p>
                                <h3 className="text-3xl font-bold text-white mt-2">{metrics.totalClients}</h3>
                            </div>
                            <div className="p-2 bg-white/5 rounded-md text-[#D4AF37]"><Users className="w-5 h-5" /></div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-[#0a0a0a] to-black border border-white/10">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-white/40 text-xs uppercase font-bold tracking-wider">Valor Cartera</p>
                                <h3 className="text-3xl font-bold text-white mt-2">{((metrics.totalValue / 1000000).toFixed(1))}M</h3>
                            </div>
                            <div className="p-2 bg-white/5 rounded-md text-green-400"><DollarSign className="w-5 h-5" /></div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-[#0a0a0a] to-black border border-white/10">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-white/40 text-xs uppercase font-bold tracking-wider">Tasa Actividad</p>
                                <h3 className="text-3xl font-bold text-white mt-2">{Math.round((metrics.activeClients / metrics.totalClients) * 100)}%</h3>
                            </div>
                            <div className="p-2 bg-white/5 rounded-md text-blue-400"><TrendingUp className="w-5 h-5" /></div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-[#0a0a0a] to-black border border-white/10">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-white/40 text-xs uppercase font-bold tracking-wider">En Auditoría</p>
                                <h3 className="text-3xl font-bold text-[#D4AF37] mt-2">{metrics.auditClients}</h3>
                            </div>
                            <div className="p-2 bg-white/5 rounded-md text-yellow-400"><AlertCircle className="w-5 h-5" /></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Table */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/40" />
                            <Input
                                placeholder="Buscar cliente por nombre, ID o industria..."
                                className="pl-9 bg-[#0a0a0a] border-white/10 focus-visible:ring-[#D4AF37] text-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="border-white/10 text-white/60 hover:text-[#D4AF37] hover:bg-white/5">
                            <Filter className="w-4 h-4 mr-2" />
                            Filtrar
                        </Button>
                    </div>

                    <div className="rounded-md border border-white/10 bg-black overflow-hidden relative">
                        <div className="max-h-[500px] overflow-auto custom-scrollbar">
                            <Table>
                                <TableHeader className="sticky top-0 bg-[#0a0a0a] z-10">
                                    <TableRow className="border-white/10 hover:bg-transparent">
                                        <TableHead className="text-white/60 text-xs uppercase w-[100px]">ID</TableHead>
                                        <TableHead className="text-white/60 text-xs uppercase">Cliente / Industria</TableHead>
                                        <TableHead className="text-white/60 text-xs uppercase">Estado</TableHead>
                                        <TableHead className="text-white/60 text-xs uppercase text-right">Valor Anual</TableHead>
                                        <TableHead className="text-white/60 text-xs uppercase text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredClients.map((client) => (
                                        <TableRow key={client.id} className="border-white/5 hover:bg-white/5 group">
                                            <TableCell className="font-mono text-white/50 text-xs">{client.id}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-white">{client.name}</span>
                                                    <span className="text-xs text-white/40">{client.industry}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`text-[10px] ${getStatusColor(client.status)}`}>
                                                    {client.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-white font-mono">
                                                {formatCurrency(client.annualValue)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-white/50 hover:text-[#D4AF37]">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-white/10 text-white">
                                                        <DropdownMenuItem onClick={() => setSelectedClient(client)} className="focus:bg-white/10 focus:text-white cursor-pointer">
                                                            <FileText className="w-4 h-4 mr-2" />
                                                            Ver Perfil Completo
                                                        </DropdownMenuItem>
                                                        {appUser?.role !== 'EMPLOYEE' && (
                                                            <>
                                                                <DropdownMenuSeparator className="bg-white/10" />
                                                                <DropdownMenuItem 
                                                                    className="focus:bg-white/10 focus:text-white cursor-pointer"
                                                                    onClick={async (e) => {
                                                                        e.stopPropagation()
                                                                        try {
                                                                            const toggleFn = httpsCallable<{uid: string, disabled: boolean}, any>(cloudFunctions, 'toggleUserStatus');
                                                                            await toggleFn({ uid: client.full_uid, disabled: client.status !== 'Inactivo' });
                                                                        } catch(err) {
                                                                            console.error(err);
                                                                            alert("Error alterando servicios.");
                                                                        }
                                                                    }}
                                                                >
                                                                    {client.status === 'Inactivo' ? <><CheckCircle2 className="w-4 h-4 mr-2 text-green-400" /> Reactivar Acceso</> : <><XCircle className="w-4 h-4 mr-2 text-yellow-400" /> Suspender Cliente</>}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem 
                                                                    onClick={async (e) => {
                                                                         e.stopPropagation();
                                                                         if(!confirm(`Esta acción eliminará TODO TIPO de dato fiscal e identidad del cliente ${client.name}. Es irreversible. ¿Proceder?`)) return;
                                                                         try {
                                                                             const delFn = httpsCallable<{uid: string}, any>(cloudFunctions, 'deleteUser');
                                                                             await delFn({ uid: client.full_uid });
                                                                         } catch (err) {
                                                                             alert("Fallo crítico en purga.");
                                                                         }
                                                                    }}
                                                                    className="text-red-400 focus:bg-red-900/20 focus:text-red-400 cursor-pointer"
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    Purga de Cliente
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="p-2 border-t border-white/10 bg-[#0a0a0a] text-xs text-white/40 text-center">
                            Mostrando {filteredClients.length} de {clients.length} clientes
                        </div>
                    </div>
                </div>

                {/* Charts Sidebar */}
                <div className="space-y-6">
                    <Card className="bg-[#0a0a0a] border border-white/10">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold text-white">Distribución por Industria</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[250px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={metrics.industryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {metrics.industryData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </RePieChart>
                            </ResponsiveContainer>
                            {/* Center Label */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    <span className="block text-2xl font-bold text-white">{metrics.totalClients}</span>
                                    <span className="text-[10px] text-white/50 uppercase tracking-widest">Total</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0a0a0a] border border-white/10 p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white/50 text-xs uppercase">Crecimiento Q4</p>
                                <h4 className="text-xl font-bold text-white">+12 Nuevos Clientes</h4>
                            </div>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#D4AF37] h-full w-[70%]" />
                        </div>
                        <p className="text-xs text-white/40 mt-2 text-right">Meta: 15 clientes</p>
                    </Card>
                </div>
            </div>
        </div>
    )
}
