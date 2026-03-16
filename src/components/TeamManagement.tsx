"use client"

import { useState, useEffect } from "react"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { httpsCallable } from "firebase/functions";
import { db, cloudFunctions } from "../lib/firebase/config";
import { doc, updateDoc, collection, query, where, onSnapshot } from "firebase/firestore";

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
    Briefcase,
    Users,
    UserCheck,
    Clock,
    Copy,
    Edit2,
    Trash2,
    XCircle
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// --- Types ---
type Role = "Admin" | "Contador" | "Auditor" | "Gestor"
type Status = "Activo" | "Inactivo" | "Pendiente"

interface TeamMember {
    id: string
    full_uid: string
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

// --- Initial State ---
const INITIAL_TEAM: TeamMember[] = [];

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

function MemberProfile({ member, onBack, onStatusToggle }: { member: TeamMember, onBack: () => void, onStatusToggle: (full_uid: string, id: string, currentStatus: Status) => void }) {
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);

    // Clients logic
    const [clients, setClients] = useState<{ id: string, name: string, assignedTo?: string }[]>([]);
    const [selectedClientId, setSelectedClientId] = useState("");
    const [isAssigning, setIsAssigning] = useState(false);

    useEffect(() => {
        // Obtenemos en tiempo real los clientes para que si se asigna se actualice la lista
        const q = query(collection(db, "users"), where("role", "==", "CLIENT"));
        const unsub = onSnapshot(q, (snapshot) => {
            const fetched: {id: string, name: string, assignedTo?: string}[] = [];
            snapshot.forEach(d => {
                fetched.push({
                    id: d.id,
                    name: d.data().name || d.data().email || "Sin Nombre",
                    assignedTo: d.data().employee_id
                });
            });
            setClients(fetched);
            const unbound = fetched.filter(c => c.assignedTo !== member.full_uid);
            if (unbound.length > 0) setSelectedClientId(unbound[0].id);
            else setSelectedClientId("");
        });
        return () => unsub();
    }, [member.full_uid]);

    const handleAssign = async () => {
        if (!selectedClientId) return;
        setIsAssigning(true);
        try {
            await updateDoc(doc(db, "users", selectedClientId), {
                employee_id: member.full_uid
            });
            alert("Cliente vinculado exitosamente a este empleado.");
        } catch (err: any) {
            console.error(err);
            alert("Error vinculando: " + err.message);
        } finally {
            setIsAssigning(false);
        }
    };

    const handleUnassign = async (clientId: string) => {
        if(!confirm("¿Retirar cliente de este portafolio?")) return;
        try {
            await updateDoc(doc(db, "users", clientId), {
                employee_id: null
            });
        } catch (err: any) {
            alert("Error al retirar: " + err.message);
        }
    };

    const assignedClients = clients.filter(c => c.assignedTo === member.full_uid);
    const availableClients = clients.filter(c => c.assignedTo !== member.full_uid);

    const handleGenerateLink = async () => {
        setIsGeneratingLink(true);
        setGeneratedLink(null);
        try {
            const generateFn = httpsCallable<{email: string}, {link: string}>(cloudFunctions, 'generateResetLink');
            const res = await generateFn({ email: member.email });
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
            {/* Header / Actions */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => {
                        setGeneratedLink(null);
                        onBack();
                    }}
                    className="text-white/60 hover:text-[#D4AF37] hover:bg-white/5 pl-0 gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver al equipo
                </Button>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onStatusToggle(member.full_uid, member.id, member.status)}
                        className={`
                            ${member.status === 'Activo'
                                ? 'border-red-500/50 text-red-500 hover:bg-red-950/30'
                                : 'border-green-500/50 text-green-500 hover:bg-green-950/30'}
                        `}
                    >
                        {member.status === 'Activo' ? 'Desactivar Cuenta' : 'Activar Cuenta'}
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="default" className="bg-[#D4AF37] text-black hover:bg-[#b5952f]">
                                Editar Perfil
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0f0f0f] border-white/10 text-white sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Editar Perfil</DialogTitle>
                                <DialogDescription className="text-white/40">Modifica los detalles del empleado.</DialogDescription>
                            </DialogHeader>
                            <form 
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const name = formData.get("name") as string;
                                    const department = formData.get("department") as string;
                                    try {
                                        const editFn = httpsCallable<any, any>(cloudFunctions, 'editUserProfile');
                                        await editFn({ uid: member.id, name, department });
                                        alert("Perfil actualizado satisfactoriamente.");
                                    } catch (err: any) {
                                        console.error(err);
                                        alert("Error al actualizar: " + err.message);
                                    }
                                }} 
                                className="space-y-4 py-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-white/60">Nombre Completo</label>
                                    <Input name="name" defaultValue={member.name} className="bg-black border-white/10 focus-visible:ring-[#D4AF37]" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-white/60">Departamento</label>
                                    <Input name="department" defaultValue={member.department} className="bg-black border-white/10 focus-visible:ring-[#D4AF37]" required />
                                </div>
                                <DialogFooter className="mt-6">
                                    <Button type="submit" className="bg-[#D4AF37] text-black hover:bg-[#b5952f]">Guardar Cambios</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
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
                            
                            {/* Panel especial sólo si el usuario es "Pendiente" */}
                            {member.status === 'Pendiente' && (
                                <>
                                    <Separator className="bg-white/5" />
                                    <div className="pt-2">
                                        <p className="text-xs text-white/40 mb-3">El usuario no ha establecido su contraseña. Puedes re-generar el enlace de invitación.</p>
                                        {!generatedLink ? (
                                            <Button 
                                                variant="outline" 
                                                className="w-full border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                                                onClick={handleGenerateLink}
                                                disabled={isGeneratingLink}
                                            >
                                                {isGeneratingLink ? 'Generando...' : 'Re-Generar Enlace de Acceso'}
                                            </Button>
                                        ) : (
                                            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 p-3 rounded-md space-y-3">
                                                 <p className="text-xs text-[#D4AF37] font-medium flex items-center gap-1">
                                                     <CheckCircle2 className="w-3 h-3" /> Link Generado
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
                                                        title="Copiar Link"
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

            {/* Asignación de Portafolio (Bóvedas Vinculadas) */}
            {member.role !== 'Admin' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    {/* Tabla de asignados */}
                    <Card className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 p-6">
                        <h3 className="text-white text-sm uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#D4AF37]"/> Portafolio Asignado ({assignedClients.length})
                        </h3>
                        {assignedClients.length === 0 ? (
                            <div className="text-center py-8 text-white/30 text-sm">
                                No tiene cuentas asignadas o bajo su responsabilidad.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-[10px] uppercase text-white/40 border-b border-white/10">
                                        <tr>
                                            <th className="pb-3 font-medium">Cliente</th>
                                            <th className="pb-3 font-medium">Ref ID</th>
                                            <th className="pb-3 text-right font-medium">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {assignedClients.map((client) => (
                                            <tr key={client.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="py-3 font-medium text-white">{client.name}</td>
                                                <td className="py-3 text-white/50 font-mono text-xs">{client.id.substring(0,8).toUpperCase()}</td>
                                                <td className="py-3 text-right">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => handleUnassign(client.id)}
                                                        className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                                    >
                                                        Retirar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>

                    {/* Módulo de Asignación */}
                    <div className="space-y-6">
                        <Card className="bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-white/10 p-6">
                            <h3 className="text-white text-sm uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                                <UserPlus className="w-4 h-4 text-[#D4AF37]"/> Vincular Cuenta
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase text-white/50 font-bold mb-1 block">Cliente Disponible</label>
                                    <select 
                                        className="w-full bg-black border border-white/10 text-sm text-white rounded p-2 outline-none focus:border-[#D4AF37]"
                                        value={selectedClientId}
                                        onChange={e => setSelectedClientId(e.target.value)}
                                        disabled={availableClients.length === 0}
                                    >
                                        {availableClients.length === 0 ? (
                                            <option value="">No hay clientes libres</option>
                                        ) : (
                                            availableClients.map(c => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name} {c.assignedTo ? '(Transferir)' : ''}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                                <Button 
                                    className="w-full bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white text-xs uppercase tracking-widest font-bold py-2 transition-colors"
                                    onClick={handleAssign}
                                    disabled={isAssigning || !selectedClientId}
                                >
                                    {isAssigning ? "Vinculando..." : "Signar a Bóveda"}
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}

// Zod Schema for Employee
const EmployeeSchema = z.object({
    name: z.string().min(3, "El nombre completo es requerido"),
    email: z.string().email("Correo corporativo inválido"),
    role: z.enum(["EMPLOYEE", "ADMIN"]),
    department: z.string().min(2, "Departamento es obligatorio"),
    phone: z.string().optional()
});

type EmployeeFormType = z.infer<typeof EmployeeSchema>;

export function TeamManagement() {
    const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM)
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

    useEffect(() => {
        const q = query(collection(db, "users"), where("role", "in", ["ADMIN", "EMPLOYEE"]));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedTeam: TeamMember[] = [];
            snapshot.forEach((docSnap) => {
                const data = docSnap.data();

                let parsedDate = "N/A";
                if (data.createdAt) {
                    if (data.createdAt.seconds) {
                        parsedDate = new Date(data.createdAt.seconds * 1000).toLocaleDateString('es-MX');
                    } else if (typeof data.createdAt === 'string') {
                        parsedDate = new Date(data.createdAt).toLocaleDateString('es-MX');
                    }
                }

                // Parse Role exactly to Match TeamMember Type ("Admin" | "Contador" | "Auditor" | "Gestor")
                let safeRole: Role = "Gestor"; // Default UI fallback
                if (data.role === "ADMIN") safeRole = "Admin";
                if (data.role === "EMPLOYEE") {
                    // We can map department to specific UI roles if needed, or keep Gestor
                    if (data.department?.toLowerCase().includes("cont")) safeRole = "Contador";
                    else if (data.department?.toLowerCase().includes("audit")) safeRole = "Auditor";
                }

                let safeStatus: Status = "Pendiente";
                if (data.disabled) safeStatus = "Inactivo";
                else if (data.status) safeStatus = data.status as Status;
                else if (data.is_active) safeStatus = "Activo";

                fetchedTeam.push({
                    id: docSnap.id.substring(0, 8).toUpperCase(),
                    full_uid: docSnap.id,
                    name: data.name || "Usuario RH",
                    email: data.email || "Sin Email",
                    role: safeRole,
                    department: data.department || "Operaciones",
                    status: safeStatus,
                    lastActive: "Reciente",
                    initials: data.initials || (data.name ? data.name.substring(0, 2).toUpperCase() : "US"),
                    phone: data.phone,
                    location: data.location || "Remoto",
                    joinDate: parsedDate
                });
            });
            setTeam(fetchedTeam);
        }, (error) => {
            console.error("Error fetching team realtime:", error);
        });

        return () => unsubscribe();
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitResult, setSubmitResult] = useState<{ type: 'success' | 'error', msg: string, link?: string } | null>(null)

    const { register, handleSubmit, formState: { errors }, reset } = useForm<EmployeeFormType>({
        resolver: zodResolver(EmployeeSchema),
        defaultValues: { role: "EMPLOYEE" }
    });

    const onSubmit = async (data: EmployeeFormType) => {
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const inviteUserCommand = httpsCallable<{ email: string, role: string }, { resetLink: string, uid: string }>(cloudFunctions, "inviteUser");

            // 1. Invocar Función (Crea User Firebase Auth + Custom Claims + Base DB Doc)
            const response = await inviteUserCommand({
                email: data.email,
                role: data.role
            });

            // 2. Inyectar Meta-Datos de Recursos Humanos (Firestore 'users')
            const newUid = response.data.uid;
            await updateDoc(doc(db, "users", newUid), {
                name: data.name,
                department: data.department,
                phone: data.phone || "",
                status: "Pendiente",
                initials: data.name.substring(0, 2).toUpperCase()
            });

            setSubmitResult({
                type: 'success',
                msg: `El usuario (${data.role}) ha sido inyectado en la red con éxito.`,
                link: response.data.resetLink
            });
            reset();


        } catch (error: any) {
            console.error(error);
            setSubmitResult({ type: 'error', msg: "Fallo crítico en subrutina de creación: " + error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter logic
    const filteredTeam = team.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Actions
    const handleStatusToggle = async (full_uid: string, id: string, currentStatus: Status) => {
        try {
            const toggleFn = httpsCallable<{uid: string, disabled: boolean}, any>(cloudFunctions, 'toggleUserStatus');
            const newDisabled = currentStatus === 'Activo'; 
            await toggleFn({ uid: full_uid, disabled: newDisabled });
            if (selectedMember?.id === id) {
                 setSelectedMember({ ...selectedMember, status: newDisabled ? 'Inactivo' : 'Activo' });
            }
        } catch (e: any) {
             console.error(e);
             alert("Error alterando el estado de la cuenta.");
        }
    }

    const handleDelete = async (full_uid: string, id: string) => {
        if (!confirm("Esta acción destruirá el Vault criptográfico y la cuenta del empleado permanentemente. ¿Proceder?")) return;
        try {
             const delFn = httpsCallable<{uid: string}, any>(cloudFunctions, 'deleteUser');
             await delFn({ uid: full_uid });
             if (selectedMember?.id === id) setSelectedMember(null);
        } catch (e: any) {
             console.error(e);
             alert("Error al intentar revocar la identidad.");
        }
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
                                Las credenciales de acceso se generarán automáticamente.
                            </DialogDescription>
                        </DialogHeader>

                        {submitResult?.type === 'success' ? (
                            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] p-4 rounded-lg text-sm mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                                    <p className="font-bold">{submitResult.msg}</p>
                                </div>
                                <div className="bg-black/50 border border-[#D4AF37]/20 rounded-md p-3 relative group">
                                    <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]/70 font-bold mb-1">Enlace Criptográfico de Establecimiento:</p>
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
                                    <p className="text-[9px] text-[#D4AF37]/50 mt-2">Cópialo y envíaselo al miembro por un canal seguro.</p>
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

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-bold text-white/60">Nombre Completo</label>
                                        <Input {...register("name")} placeholder="Ej. Juan Pérez" className="bg-black border-white/10 focus-visible:ring-[#D4AF37]" />
                                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-bold text-white/60">Email Corporativo</label>
                                        <Input {...register("email")} type="email" placeholder="usuario@zechnas.com" className="bg-black border-white/10 focus-visible:ring-[#D4AF37]" />
                                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase font-bold text-white/60">Rol (Claim)</label>
                                            <select {...register("role")} className="flex h-9 w-full rounded-md border border-white/10 bg-black px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]">
                                                <option value="EMPLOYEE">Empleado Operativo</option>
                                                <option value="ADMIN">Administrador Zechnas</option>
                                            </select>
                                            {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase font-bold text-white/60">Departamento</label>
                                            <Input {...register("department")} placeholder="Ej. Finanzas" className="bg-black border-white/10 focus-visible:ring-[#D4AF37]" />
                                            {errors.department && <p className="text-red-500 text-xs">{errors.department.message}</p>}
                                        </div>
                                    </div>
                                    <DialogFooter className="mt-6">
                                        <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="text-white hover:text-[#D4AF37]">Cerrar</Button>
                                        <Button type="submit" disabled={isSubmitting} className="bg-[#D4AF37] text-black hover:bg-[#b5952f] disabled:opacity-50">
                                            {isSubmitting ? "Ejecutando..." : "Registrar Identidad"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="bg-[#0a0a0a] border border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white/50 uppercase tracking-wider">Total Miembros</CardTitle>
                        <Users className="h-4 w-4 text-[#D4AF37]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{team.length}</div>
                        <p className="text-xs text-white/40 mt-1">+1 esta semana</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#0a0a0a] border border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white/50 uppercase tracking-wider">Miembros Activos</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{team.filter(m => m.status === 'Activo').length}</div>
                        <p className="text-xs text-white/40 mt-1">
                            {Math.round((team.filter(m => m.status === 'Activo').length / team.length) * 100)}% de operatividad
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-[#0a0a0a] border border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white/50 uppercase tracking-wider">Pendientes</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{team.filter(m => m.status === 'Pendiente').length}</div>
                        <p className="text-xs text-white/40 mt-1">Solicitudes de acceso</p>
                    </CardContent>
                </Card>
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
                                                    <Edit2 className="w-4 h-4 mr-2" />
                                                    Editar Perfil
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-white/10" />
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusToggle(member.full_uid, member.id, member.status)}
                                                    className="focus:bg-white/10 focus:text-white cursor-pointer"
                                                >
                                                    {member.status === 'Activo' ? <><XCircle className="w-4 h-4 mr-2 text-red-400" /> Desactivar Accesos</> : <><CheckCircle2 className="w-4 h-4 mr-2 text-green-400" /> Reactivar Cuenta</>}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(member.full_uid, member.id)}
                                                    className="text-red-400 focus:bg-red-900/20 focus:text-red-400 cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
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
