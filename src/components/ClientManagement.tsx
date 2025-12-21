import { useState, useMemo } from "react"
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
    MoreHorizontal,
    FileText
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

// --- Mock Data Generator ---
const generateClients = (count: number): Client[] => {
    const industries: Industry[] = ["Tecnología", "Salud", "Finanzas", "Manufactura", "Retail", "Energía"]
    const statuses: ClientStatus[] = ["Activo", "Activo", "Activo", "Pendiente", "Inactivo", "Auditoría"]
    const locations = ["CDMX", "Monterrey", "Guadalajara", "Querétaro", "Mérida", "Tijuana"]
    const firstNames = ["Tech", "Global", "Inter", "Mex", "Nova", "Alpha", "Prime", "Star", "Blue", "Red"]
    const lastNames = ["Corp", "Systems", "Solutions", "Industries", "Group", "Holdings", "Logistics", "Energy", "Pharma"]

    // Fixed seed data for first few for consistency
    const data: Client[] = [
        { id: "CL-001", name: "TechNova Corp", industry: "Tecnología", status: "Activo", contactName: "Juan Pérez", email: "juan@technova.com", phone: "+52 55 1234 5678", location: "CDMX", annualValue: 1250000, joinDate: "2023-01-15", projectsCount: 3 },
        { id: "CL-002", name: "MediCare Plus", industry: "Salud", status: "Activo", contactName: "Ana López", email: "ana@medicare.com", phone: "+52 55 8765 4321", location: "Monterrey", annualValue: 850000, joinDate: "2023-03-10", projectsCount: 2 },
        { id: "CL-003", name: "FinGroup Int", industry: "Finanzas", status: "Auditoría", contactName: "Carlos Ruiz", email: "carlos@fingroup.com", phone: "+52 33 1122 3344", location: "Guadalajara", annualValue: 2100000, joinDate: "2022-11-05", projectsCount: 5 },
    ]

    for (let i = 4; i <= count; i++) {
        const industry = industries[Math.floor(Math.random() * industries.length)]
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]} ${Math.floor(Math.random() * 100)}`
        data.push({
            id: `CL-${i.toString().padStart(3, '0')}`,
            name: name,
            industry: industry,
            status: status,
            contactName: `Director ${i}`,
            email: `contacto@${name.replace(/\s/g, '').toLowerCase()}.com`,
            phone: `+52 ${Math.floor(Math.random() * 99)} ${Math.floor(Math.random() * 9999)} ${Math.floor(Math.random() * 9999)}`,
            location: locations[Math.floor(Math.random() * locations.length)],
            annualValue: Math.floor(Math.random() * 2000000) + 100000,
            joinDate: `2023-${Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}`,
            projectsCount: Math.floor(Math.random() * 8) + 1
        })
    }
    return data
}

const INITIAL_CLIENTS = generateClients(50)

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

    return (
        <div className="space-y-6 w-full animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="text-white/60 hover:text-[#D4AF37] hover:bg-white/5 pl-0 gap-2">
                    <ArrowLeft className="w-5 h-5" /> Volver al listado
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-white/10 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]">
                        <FileText className="w-4 h-4 mr-2" /> Reporte Fiscal
                    </Button>
                    <Button className="bg-[#D4AF37] text-black hover:bg-[#b5952f]">
                        Editar Cliente
                    </Button>
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

export function ClientManagement() {
    const [clients] = useState<Client[]>(INITIAL_CLIENTS)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

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
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#D4AF37] text-black hover:bg-[#b5952f] font-bold">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Nuevo Cliente
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0f0f0f] border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
                            <DialogDescription className="text-white/40">Ingrese los datos fiscales y de contacto.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/50">Razón Social</label>
                                    <Input className="bg-black border-white/10" placeholder="Nombre de la empresa" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/50">RFC</label>
                                    <Input className="bg-black border-white/10" placeholder="XAXX010101000" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/50">Industria</label>
                                <select className="flex h-9 w-full rounded-md border border-white/10 bg-black px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]">
                                    <option>Tecnología</option>
                                    <option>Finanzas</option>
                                    <option>Salud</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/50">Contacto Principal</label>
                                <Input className="bg-black border-white/10" placeholder="Nombre completo" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="text-white hover:text-[#D4AF37]">Cancelar</Button>
                            <Button onClick={() => setIsAddDialogOpen(false)} className="bg-[#D4AF37] text-black hover:bg-[#b5952f]">Registrar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
                                                            Ver Perfil Completo
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                                                            Historial de Pagos
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-white/10" />
                                                        <DropdownMenuItem className="text-red-400 focus:bg-red-900/20 focus:text-red-400 cursor-pointer">
                                                            Archivar Cliente
                                                        </DropdownMenuItem>
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
