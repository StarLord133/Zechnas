import { Users, AlertCircle, FileSpreadsheet, ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";
import { db } from "../../lib/firebase/config";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

const STATS = [
    { title: "Total Clientes", value: "142", icon: Users, trend: "+12 este mes", trendColor: "text-green-400" },
    { title: "Contadores Activos", value: "8", icon: ShieldAlert, trend: "Operando al 92% de capacidad", trendColor: "text-[#D4AF37]" },
    { title: "Declaraciones Pdtes", value: "34", icon: Clock, trend: "Cierre de mes en 3 días", trendColor: "text-yellow-400" },
    { title: "Atrasos Críticos", value: "2", icon: AlertCircle, trend: "Requieren atención inmediata", trendColor: "text-red-500" },
];

const COMPLIANCE_DATA = [
    { client: "Tech Solutions S.A.", employee: "María G.", status: "Finalizado", currentMonth: "Marzo 2026" },
    { client: "Comercializadora MX", employee: "José RM.", status: "Esperando Pago", currentMonth: "Marzo 2026" },
    { client: "Global Imports LLC", employee: "Ana V.", status: "En Proceso", currentMonth: "Marzo 2026" },
    { client: "Restaurante El Toro", employee: "Carlos D.", status: "Pendiente", currentMonth: "Marzo 2026" },
    { client: "Consultores y Asoc.", employee: "María G.", status: "Atrasado", currentMonth: "Febrero 2026" },
];

const PERFORMANCE_DATA = [
    { name: "María G.", clients: 25, completed: 22 },
    { name: "José RM.", clients: 20, completed: 18 },
    { name: "Ana V.", clients: 18, completed: 15 },
    { name: "Carlos D.", clients: 15, completed: 8 },
];

const AUDIT_LOGS = [
    { action: "Documentos Subidos - Marzo", user: "María G.", client: "Tech Solutions S.A.", time: "Hace 10 min", type: "success" },
    { action: "Estado cambiado a Esperando Pago", user: "José RM.", client: "Comercializadora MX", time: "Hace 1 hora", type: "warning" },
    { action: "Asignación de Cartera", user: "SuperAdmin", client: "Global Imports -> Ana V.", time: "Hace 2 horas", type: "info" },
    { action: "Falla de Validación (Monto Cero)", user: "Carlos D.", client: "Restaurante El Toro", time: "Hace 5 horas", type: "error" },
];

const getStatusColor = (status: string) => {
    switch(status) {
        case "Finalizado": return "text-green-400 bg-green-400/10 border-green-400/20";
        case "Esperando Pago": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
        case "En Proceso": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
        case "Atrasado": return "text-red-400 bg-red-400/10 border-red-400/20";
        default: return "text-white/50 bg-white/5 border-white/10";
    }
};

export const AdminDashboard = () => {
    const [employees, setEmployees] = useState<{id: string, name: string}[]>([]);
    const [clients, setClients] = useState<{id: string, name: string, assignedTo?: string}[]>([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [selectedClientId, setSelectedClientId] = useState("");
    const [isAssigning, setIsAssigning] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const empQuery = query(collection(db, "users"), where("role", "==", "EMPLOYEE"));
                const cliQuery = query(collection(db, "users"), where("role", "==", "CLIENT"));

                const [empSnap, cliSnap] = await Promise.all([getDocs(empQuery), getDocs(cliQuery)]);

                const empList = empSnap.docs.map(d => ({ id: d.id, name: d.data().name || "Sin nombre" }));
                const cliList = cliSnap.docs.map(d => ({ id: d.id, name: d.data().name || d.data().email || "Sin nombre", assignedTo: d.data().employee_id }));
                
                setEmployees(empList);
                setClients(cliList);

                if (empList.length > 0) setSelectedEmployeeId(empList[0].id);
                if (cliList.length > 0) setSelectedClientId(cliList[0].id);
            } catch (err) {
                console.error("Error fetching users for assignment:", err);
            }
        };
        fetchUsers();
    }, []);

    const handleAssign = async () => {
        if (!selectedEmployeeId || !selectedClientId) return;
        setIsAssigning(true);
        try {
            await updateDoc(doc(db, "users", selectedClientId), {
                employee_id: selectedEmployeeId
            });
            alert("Portafolio vinculado con éxito y políticas de acceso actualizadas remotamente.");
            // Refresh list or optimistic update
            setClients(prev => prev.map(c => c.id === selectedClientId ? { ...c, assignedTo: selectedEmployeeId } : c));
        } catch (err: any) {
            console.error(err);
            alert("Error crítico alterando bóveda: " + err.message);
        } finally {
            setIsAssigning(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header / Top KPI Row */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-white">Panel de Supervisión (ADMIN)</h2>
                    <p className="text-white/40 text-sm mt-1 tracking-widest uppercase">Monitoreo de Cumplimiento y Carga de Trabajo</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, i) => (
                    <div key={i} className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-white/50 text-xs uppercase tracking-wider font-bold mb-1">{stat.title}</p>
                                <h3 className={`text-3xl font-bold text-white ${stat.title === 'Atrasos Críticos' && stat.value !== "0" ? 'text-red-500' : ''}`}>{stat.value}</h3>
                            </div>
                            <div className="p-3 bg-[#D4AF37]/10 rounded-lg">
                                <stat.icon className="text-[#D4AF37] w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className={`${stat.trendColor} text-[10px] uppercase font-bold tracking-widest`}>{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Middle Section: Compliance Display & Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-lg border border-white/10 bg-[#0a0a0a]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-white text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#D4AF37]"/> Monitor de Cumplimiento
                        </h3>
                        <select className="bg-black border border-white/10 text-xs text-white/60 rounded px-2 py-1 outline-none focus:border-[#D4AF37]">
                            <option>Marzo 2026</option>
                            <option>Febrero 2026</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[10px] uppercase text-white/40 border-b border-white/10">
                                <tr>
                                    <th className="pb-3 font-medium">Cliente</th>
                                    <th className="pb-3 font-medium">Contador Asignado</th>
                                    <th className="pb-3 font-medium">Periodo</th>
                                    <th className="pb-3 text-right font-medium">Estatus Actual</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {COMPLIANCE_DATA.map((row, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                                        <td className="py-3 font-medium text-white">{row.client}</td>
                                        <td className="py-3 text-white/60">{row.employee}</td>
                                        <td className="py-3 text-white/60 font-mono text-xs">{row.currentMonth}</td>
                                        <td className="py-3 text-right">
                                            <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold border ${getStatusColor(row.status)}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Create User Quick Action / Asignación */}
                <div className="space-y-6">
                    <div className="p-6 rounded-lg border border-white/10 bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
                        <h3 className="text-white text-sm uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#D4AF37]"/> Asignar Portafolio
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] uppercase text-white/50 font-bold mb-1 block">Contador (Empleado)</label>
                                <select 
                                    className="w-full bg-black border border-white/10 text-sm text-white rounded p-2 outline-none focus:border-[#D4AF37]"
                                    value={selectedEmployeeId}
                                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                >
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase text-white/50 font-bold mb-1 block">Cliente a Asignar</label>
                                <select 
                                    className="w-full bg-black border border-white/10 text-sm text-white rounded p-2 outline-none focus:border-[#D4AF37]"
                                    value={selectedClientId}
                                    onChange={(e) => setSelectedClientId(e.target.value)}
                                >
                                    {clients.map(cli => {
                                        const assignedMsg = cli.assignedTo ? " (Ya asignado)" : " (Libre)";
                                        return (
                                            <option key={cli.id} value={cli.id}>{cli.name}{assignedMsg}</option>
                                        );
                                    })}
                                </select>
                            </div>
                            <button 
                                onClick={handleAssign}
                                disabled={isAssigning || employees.length === 0 || clients.length === 0}
                                className="w-full bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white text-xs uppercase tracking-widest font-bold py-2 rounded transition-colors disabled:opacity-50"
                            >
                                {isAssigning ? "Sincronizando..." : "Vincular Entidades"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-lg border border-white/10 bg-[#0a0a0a] h-[350px]">
                    <h3 className="text-white text-sm uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-[#D4AF37]"/> Rendimiento Operativo (Declaraciones del Mes)
                    </h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={PERFORMANCE_DATA} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={true} vertical={false} />
                            <XAxis type="number" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis dataKey="name" type="category" stroke="#fff" fontSize={11} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', paddingTop: '10px' }} />
                            <Bar dataKey="clients" name="Clientes Asignados" fill="#333" radius={[0, 4, 4, 0]} maxBarSize={15} />
                            <Bar dataKey="completed" name="Cargas Completadas" fill="#D4AF37" radius={[0, 4, 4, 0]} maxBarSize={15} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="p-6 rounded-lg border border-white/10 bg-[#0a0a0a] overflow-hidden flex flex-col">
                    <h3 className="text-white text-sm uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-[#D4AF37]"/> Feed de Auditoría
                    </h3>
                    <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        {AUDIT_LOGS.map((log, i) => (
                            <div key={i} className="p-3 rounded bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                        log.type === 'success' ? 'bg-green-500' :
                                        log.type === 'warning' ? 'bg-yellow-500' : 
                                        log.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                    }`} />
                                    <span className="text-white text-xs font-bold">{log.action}</span>
                                </div>
                                <div className="text-[10px] text-white/50 uppercase tracking-wider pl-3.5 mb-1">
                                    {log.client}
                                </div>
                                <div className="flex items-center justify-between text-[9px] text-white/30 uppercase pl-3.5">
                                    <span className="text-[#D4AF37]">{log.user}</span>
                                    <span>{log.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
