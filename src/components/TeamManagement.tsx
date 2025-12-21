"use client"

import { useState } from "react"
import {
    UserPlus,
    MoreHorizontal,
    Mail,
    Shield,
    CheckCircle2,
    Search,
    Filter,
    ArrowLeft,
    Phone,
    MapPin,
    Briefcase
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
    DropdownMenuLabel,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// --- Types ---
type Role = "Admin" | "Contador" | "Auditor" | "Gestor"
type Status = "Activo" | "Inactivo" | "Pendiente"

interface TeamMember {
    id: string
    name: string
    email: string
    role: Role
    department: string
    status: Status
    lastActive: string
    avatarUrl?: string
    initials: string
    phone?: string
    location?: string
    joinDate?: string
}

// --- Mock Data ---
const INITIAL_TEAM: TeamMember[] = [
    {
        id: "TM-001",
        name: "Oswald Zech",
        email: "oswald@zechnas.com",
        role: "Admin",
        department: "Dirección General",
        status: "Activo",
        lastActive: "En línea ahora",
        initials: "OZ",
        phone: "+52 55 1234 5678",
        location: "CDMX, México",
        joinDate: "Enero 2023"
    },
    {
        id: "TM-002",
        name: "Lucía Méndez",
        email: "lucia.mendez@zechnas.com",
        role: "Contador",
        department: "Finanzas",
        status: "Activo",
        lastActive: "Hace 5 min",
        initials: "LM",
        phone: "+52 55 9876 5432",
        location: "Guadalajara, México",
        joinDate: "Marzo 2023"
    },
    {
        id: "TM-003",
        name: "Roberto Castro",
        email: "r.castro@zechnas.com",
        role: "Auditor",
        department: "Compliance",
        status: "Pendiente",
        lastActive: "Hace 2 días",
        initials: "RC",
        phone: "+52 81 1122 3344",
        location: "Monterrey, México",
        joinDate: "Diciembre 2023"
    },
    {
        id: "TM-004",
        name: "Ana Silva",
        email: "ana.silva@zechnas.com",
        role: "Gestor",
        department: "Atención a Clientes",
        status: "Inactivo",
        lastActive: "Hace 1 semana",
        initials: "AS",
        phone: "+52 55 5555 5555",
        location: "Remoto",
        joinDate: "Junio 2023"
    },
    {
        id: "TM-005",
        name: "Carlos Ruiz",
        email: "carlos.ruiz@zechnas.com",
        role: "Contador",
        department: "Impuestos",
        status: "Activo",
        lastActive: "Hace 1 hora",
        initials: "CR",
        phone: "+52 55 4433 2211",
        location: "CDMX, México",
        joinDate: "Agosto 2023"
    }
]

// --- Helper Functions ---
const getRoleBadgeColor = (role: Role) => {
    switch (role) {
        case "Admin": return "bg-[#D4AF37] text-black hover:bg-[#b5952f]" // Gold
        case "Contador": return "bg-blue-900/50 text-blue-200 border-blue-800 hover:bg-blue-900/70"
        case "Auditor": return "bg-purple-900/50 text-purple-200 border-purple-800 hover:bg-purple-900/70"
        default: return "bg-white/10 text-white hover:bg-white/20"
    }
}

// --- Sub-components ---

function MemberProfile({ member, onBack, onStatusToggle }: { member: TeamMember, onBack: () => void, onStatusToggle: (id: string) => void }) {
    return (
        <div className="space-y-6 w-full animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Header / Actions */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-white/60 hover:text-[#D4AF37] hover:bg-white/5 pl-0 gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver al equipo
                </Button>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onStatusToggle(member.id)}
                        className={`
                            ${member.status === 'Activo'
                                ? 'border-red-500/50 text-red-500 hover:bg-red-950/30'
                                : 'border-green-500/50 text-green-500 hover:bg-green-950/30'}
                        `}
                    >
                        {member.status === 'Activo' ? 'Desactivar Cuenta' : 'Activar Cuenta'}
                    </Button>
                    <Button variant="default" className="bg-[#D4AF37] text-black hover:bg-[#b5952f]">
                        Editar Perfil
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Profile Info */}
                <Card className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <Avatar className="h-32 w-32 border-2 border-white/10">
                            <AvatarImage src={member.avatarUrl} alt={member.name} />
                            <AvatarFallback className="bg-[#1f1f1f] text-[#D4AF37] text-3xl font-bold">
                                {member.initials}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-4 flex-1">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">{member.name}</h2>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className={`${getRoleBadgeColor(member.role)} border-0 font-medium`}>
                                        {member.role === 'Admin' && <Shield className="w-3 h-3 mr-1 inline-block" />}
                                        {member.role}
                                    </Badge>
                                    <Badge variant="outline" className="border-white/10 text-white/60">
                                        {member.department}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-t border-b border-white/10">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-[#D4AF37]" />
                                    <span className="text-white/80">{member.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                                    <span className="text-white/80">{member.phone || "No registrado"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                                    <span className="text-white/80">{member.location || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Briefcase className="w-4 h-4 text-[#D4AF37]" />
                                    <span className="text-white/80">ID Empleado: {member.id}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h4 className="text-xs uppercase font-bold text-white/40 tracking-wider">Bio / Notas</h4>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Miembro del equipo especializado en {member.department}.
                                    {member.role === 'Admin' ? ' Tiene acceso total al sistema.' : ' Enfocado en tareas operativas y de cumplimiento.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Status & Activity Side Panel */}
                <div className="space-y-6">
                    <Card className="bg-[#0f0f0f] border border-white/10 p-6">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-[#D4AF37] rounded-full"></span>
                            Estado de Cuenta
                        </h3>

                        <div className="flex items-center justify-between mb-6">
                            <span className="text-white/60 text-sm">Status Actual</span>
                            <div className={`flex items-center gap-2 text-sm font-medium ${member.status === 'Activo' ? 'text-green-400' :
                                member.status === 'Pendiente' ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                {member.status === 'Activo' && <CheckCircle2 className="w-4 h-4" />}
                                {member.status}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/50">Última Actividad</span>
                                <span className="text-white font-mono">{member.lastActive}</span>
                            </div>
                            <Separator className="bg-white/5" />
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/50">Miembro desde</span>
                                <span className="text-white font-mono">{member.joinDate || "N/A"}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-[#0f0f0f] border border-white/10 p-6">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-[#D4AF37] rounded-full"></span>
                            Permisos Activos
                        </h3>
                        <div className="space-y-2">
                            {['Acceso al Dashboard', 'Ver Facturas', 'Exportar Reportes'].map((perm, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                                    <CheckCircle2 className="w-3 h-3 text-green-500/50" />
                                    {perm}
                                </div>
                            ))}
                            {member.role === 'Admin' && (
                                <>
                                    <div className="flex items-center gap-2 text-sm text-white/70">
                                        <CheckCircle2 className="w-3 h-3 text-green-500/50" />
                                        Gestión de Usuarios
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-white/70">
                                        <CheckCircle2 className="w-3 h-3 text-green-500/50" />
                                        Configuración Global
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export function TeamManagement() {
    const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM)
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

    // Filter logic
    const filteredTeam = team.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Actions
    const handleStatusToggle = (id: string) => {
        setTeam(team.map(m => {
            if (m.id === id) {
                const updated = {
                    ...m,
                    status: (m.status === 'Activo' ? 'Inactivo' : 'Activo') as Status
                }
                // Also update selected member if it is the one being toggled
                if (selectedMember?.id === id) {
                    setSelectedMember(updated)
                }
                return updated
            }
            return m
        }))
    }

    const handleDelete = (id: string) => {
        setTeam(team.filter(m => m.id !== id))
        if (selectedMember?.id === id) setSelectedMember(null)
    }

    if (selectedMember) {
        return (
            <MemberProfile
                member={selectedMember}
                onBack={() => setSelectedMember(null)}
                onStatusToggle={handleStatusToggle}
            />
        )
    }

    return (
        <div className="space-y-6 w-full animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Gestión de Equipo</h2>
                    <p className="text-white/40 text-sm">Administra roles, accesos y permisos del personal.</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#D4AF37] text-black hover:bg-[#b5952f] font-bold">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Agregar Miembro
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0f0f0f] border-white/10 text-white sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Invitar nuevo miembro</DialogTitle>
                            <DialogDescription className="text-white/40">
                                Se enviará un correo de invitación con instrucciones de acceso.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-white/60">Nombre Completo</label>
                                <Input placeholder="Ej. Juan Pérez" className="bg-black border-white/10 focus-visible:ring-[#D4AF37]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-white/60">Email Corporativo</label>
                                <Input placeholder="usuario@zechnas.com" className="bg-black border-white/10 focus-visible:ring-[#D4AF37]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-white/60">Rol</label>
                                    <select className="flex h-9 w-full rounded-md border border-white/10 bg-black px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]">
                                        <option>Contador</option>
                                        <option>Auditor</option>
                                        <option>Gestor</option>
                                        <option>Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-white/60">Departamento</label>
                                    <Input placeholder="Ej. Finanzas" className="bg-black border-white/10 focus-visible:ring-[#D4AF37]" />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="text-white hover:text-[#D4AF37]">Cancelar</Button>
                            <Button onClick={() => setIsAddDialogOpen(false)} className="bg-[#D4AF37] text-black hover:bg-[#b5952f]">Enviar Invitación</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Controls / Filter Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/40" />
                    <Input
                        placeholder="Buscar por nombre, correo o rol..."
                        className="pl-9 bg-white/5 border-white/10 focus-visible:ring-[#D4AF37] text-white placeholder:text-white/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="border-white/10 text-white/60 hover:text-[#D4AF37] hover:bg-white/5">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                </Button>
            </div>

            {/* Members Table */}
            <Card className="bg-black border border-white/10 overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#0a0a0a]">
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="text-white/60 text-xs uppercase h-10 w-[300px]">Miembro</TableHead>
                            <TableHead className="text-white/60 text-xs uppercase h-10">Rol & Dept.</TableHead>
                            <TableHead className="text-white/60 text-xs uppercase h-10">Estado</TableHead>
                            <TableHead className="text-white/60 text-xs uppercase h-10">Último Acceso</TableHead>
                            <TableHead className="text-right text-white/60 text-xs uppercase h-10">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTeam.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-white/30">
                                    No se encontraron miembros que coincidan con tu búsqueda.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTeam.map((member) => (
                                <TableRow key={member.id} className="border-white/5 hover:bg-white/5 group transition-colors">
                                    {/* Member Info */}
                                    <TableCell className="py-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border border-white/10">
                                                <AvatarImage src={member.avatarUrl} alt={member.name} />
                                                <AvatarFallback className="bg-[#1f1f1f] text-[#D4AF37] text-xs font-bold">
                                                    {member.initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium text-sm">{member.name}</span>
                                                <span className="text-white/40 text-xs flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {member.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Role */}
                                    <TableCell className="py-3">
                                        <div className="flex flex-col items-start gap-1">
                                            <Badge variant="outline" className={`${getRoleBadgeColor(member.role)} border-0 font-medium`}>
                                                {member.role === 'Admin' && <Shield className="w-3 h-3 mr-1 inline-block" />}
                                                {member.role}
                                            </Badge>
                                            <span className="text-white/30 text-[10px] uppercase tracking-wider pl-1">
                                                {member.department}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell className="py-3">
                                        <div className={`flex items-center gap-2 text-xs font-medium ${member.status === 'Activo' ? 'text-green-400' :
                                            member.status === 'Pendiente' ? 'text-yellow-400' : 'text-red-400'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'Activo' ? 'bg-green-400 animate-pulse' :
                                                member.status === 'Pendiente' ? 'bg-yellow-400' : 'bg-red-400'
                                                }`} />
                                            {member.status}
                                        </div>
                                    </TableCell>

                                    {/* Last Active */}
                                    <TableCell className="py-3">
                                        <span className="text-white/50 text-xs font-mono">{member.lastActive}</span>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="text-right py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 text-white/50 hover:text-[#D4AF37] hover:bg-white/10">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-white/10 text-white">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() => setSelectedMember(member)}
                                                    className="focus:bg-white/10 focus:text-white cursor-pointer"
                                                >
                                                    Ver Perfil Completo
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                                                    Editar Permisos
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-white/10" />
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusToggle(member.id)}
                                                    className="focus:bg-white/10 focus:text-white cursor-pointer"
                                                >
                                                    {member.status === 'Activo' ? 'Desactivar Cuenta' : 'Reactivar Cuenta'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(member.id)}
                                                    className="text-red-400 focus:bg-red-900/20 focus:text-red-400 cursor-pointer"
                                                >
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
