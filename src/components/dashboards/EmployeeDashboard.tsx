import { useState } from "react";
import { Users, FileSpreadsheet, Upload, Edit, CheckCircle2, Clock, FileText, AlertCircle } from "lucide-react";

const MY_CLIENTS = [
    { id: "C001", name: "Tech Solutions S.A.", rfc: "TSA123456789", status: "Finalizado", currentMonth: "Marzo 2026" },
    { id: "C002", name: "Global Imports LLC", rfc: "GIL987654321", status: "En Proceso", currentMonth: "Marzo 2026" },
    { id: "C003", name: "Consultores y Asoc.", rfc: "CYA11223344", status: "Esperando Pago", currentMonth: "Marzo 2026" },
    { id: "C004", name: "Inmobiliaria Valle", rfc: "IVA55667788", status: "Pendiente", currentMonth: "Marzo 2026" },
];

const HISTORIC = [
    { month: "Febrero 2026", status: "Pagado", date: "15 Feb 2026", isr: 12500, iva: 8400 },
    { month: "Enero 2026", status: "Pagado", date: "17 Ene 2026", isr: 14200, iva: 9100 },
];

const getStatusColor = (status: string) => {
    switch (status) {
        case "Finalizado": return "text-green-400 bg-green-400/10 border-green-400/20";
        case "Pagado": return "text-green-400 bg-green-400/10 border-green-400/20";
        case "Esperando Pago": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
        case "En Proceso": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
        case "Pendiente": return "text-red-400 bg-red-400/10 border-red-400/20";
        default: return "text-white/50 bg-white/5 border-white/10";
    }
};

export const EmployeeDashboard = () => {
    const [selectedClient, setSelectedClient] = useState(MY_CLIENTS[0]);


    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-white">Consola de Captura (STAFF)</h2>
                    <p className="text-white/40 text-sm mt-1 tracking-widest uppercase">Gestor de Portafolio Asignado</p>
                </div>
            </div>

            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                    <p className="text-white/50 text-xs uppercase tracking-wider font-bold mb-1">Clientes Asignados</p>
                    <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                        {MY_CLIENTS.length} <Users className="w-5 h-5 text-[#D4AF37]" />
                    </h3>
                </div>
                <div className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                    <p className="text-white/50 text-xs uppercase tracking-wider font-bold mb-1">Por Declarar (Marzo)</p>
                    <h3 className="text-3xl font-bold text-red-400 flex items-center gap-3">
                        2 <Clock className="w-5 h-5" />
                    </h3>
                </div>
                <div className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                    <p className="text-white/50 text-xs uppercase tracking-wider font-bold mb-1">Enviados (Mes Actual)</p>
                    <h3 className="text-3xl font-bold text-green-400 flex items-center gap-3">
                        2 <CheckCircle2 className="w-5 h-5" />
                    </h3>
                </div>
            </div>

            {/* Layout Main */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Cartera Sidebar */}
                <div className="lg:col-span-1 rounded-lg border border-white/10 bg-[#0a0a0a] flex flex-col h-[650px]">
                    <div className="p-4 border-b border-white/10 bg-white/5">
                        <h3 className="text-white text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#D4AF37]" /> Mi Cartera
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        {MY_CLIENTS.map(client => (
                            <button
                                key={client.id}
                                onClick={() => setSelectedClient(client)}
                                className={`w-full text-left p-4 rounded mb-2 transition-all duration-300 border ${
                                    selectedClient.id === client.id 
                                    ? 'bg-[#D4AF37]/10 border-[#D4AF37]/50 pointer-events-none' 
                                    : 'bg-black/50 border-transparent hover:border-white/10 hover:bg-white/5'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`font-bold text-sm ${selectedClient.id === client.id ? 'text-[#D4AF37]' : 'text-white'}`}>
                                        {client.name}
                                    </span>
                                </div>
                                <div className="text-[10px] text-white/40 font-mono tracking-widest">{client.rfc}</div>
                                <div className="mt-3 flex justify-between items-center">
                                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${getStatusColor(client.status)}`}>
                                        {client.status}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Action Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Formulario de Carga */}
                    <div className="p-6 rounded-lg border border-[#D4AF37]/30 bg-gradient-to-br from-[#1a1814] to-[#0a0a0a]">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                            <div>
                                <h3 className="text-[#D4AF37] text-lg font-bold flex items-center gap-2">
                                    <Upload className="w-5 h-5" /> Subir Declaración
                                </h3>
                                <p className="text-white/60 text-xs mt-1">Cliente: <span className="font-bold text-white">{selectedClient.name}</span></p>
                            </div>
                            <select className="bg-black border border-white/20 text-sm text-white rounded p-2 outline-none focus:border-[#D4AF37]">
                                <option>Marzo 2026</option>
                                <option>Febrero 2026 (Corrección)</option>
                                <option>Enero 2026 (Corrección)</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <div className="p-4 border border-dashed border-white/20 rounded-lg bg-black hover:border-[#D4AF37] transition-colors cursor-pointer group">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <FileSpreadsheet className="w-8 h-8 text-white/30 group-hover:text-[#D4AF37] mb-2 transition-colors" />
                                        <span className="text-white/80 text-sm font-bold">Estado Financiero (PDF)</span>
                                        <span className="text-white/40 text-[10px] uppercase mt-1">Arrastra o haz clic aquí</span>
                                    </div>
                                </div>
                                <div className="p-4 border border-dashed border-white/20 rounded-lg bg-black hover:border-[#D4AF37] transition-colors cursor-pointer group">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <FileText className="w-8 h-8 text-white/30 group-hover:text-[#D4AF37] mb-2 transition-colors" />
                                        <span className="text-white/80 text-sm font-bold">Línea de Captura (PDF)</span>
                                        <span className="text-white/40 text-[10px] uppercase mt-1">Formato de Pago Bancario</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase text-white/50 font-bold mb-1 block">ISR a Pagar (MXN)</label>
                                    <input type="number" placeholder="0.00" className="w-full bg-black border border-white/10 text-sm text-white font-mono rounded p-2.5 outline-none focus:border-[#D4AF37] placeholder:text-white/20" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase text-white/50 font-bold mb-1 block">IVA a Pagar (MXN)</label>
                                    <input type="number" placeholder="0.00" className="w-full bg-black border border-white/10 text-sm text-white font-mono rounded p-2.5 outline-none focus:border-[#D4AF37] placeholder:text-white/20" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase text-white/50 font-bold mb-1 block">Estatus del Trámite</label>
                                    <select className="w-full bg-black border border-white/10 text-sm text-white rounded p-2.5 outline-none focus:border-[#D4AF37]">
                                        <option value="progreso">En Proceso</option>
                                        <option value="pago" selected>Esperando Pago (Lista para Bóveda)</option>
                                        <option value="finalizado">Completado</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="text-[10px] uppercase text-white/50 font-bold mb-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-yellow-500" /> Notas para el Cliente (Visible en su app)
                            </label>
                            <textarea 
                                rows={3}
                                placeholder="Ej: Hubo un saldo a favor que se aplicó al pago de ISR..."
                                className="w-full bg-black border border-white/10 text-sm text-white rounded p-3 outline-none focus:border-[#D4AF37] placeholder:text-white/20 resize-none"
                            ></textarea>
                        </div>

                        <button 
                            className="w-full bg-white text-black hover:bg-[#D4AF37] font-bold py-3.5 px-4 rounded transition-colors duration-300 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                        >
                            <CheckCircle2 className="w-4 h-4" /> Enviar y Notificar a Cliente
                        </button>
                    </div>

                    {/* Historial Corto */}
                    <div className="p-6 rounded-lg border border-white/10 bg-[#0a0a0a]">
                        <h3 className="text-white text-sm uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#D4AF37]" /> Cargas Anteriores
                        </h3>
                        <div className="space-y-3">
                            {HISTORIC.map((hist, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-sm tracking-widest uppercase">{hist.month}</span>
                                        <span className="text-[10px] text-white/40 mt-0.5">Subido el {hist.date}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right flex flex-col items-end">
                                            <span className="text-[#D4AF37] font-mono text-xs">ISR: ${hist.isr}</span>
                                            <span className="text-white/60 font-mono text-[10px]">IVA: ${hist.iva}</span>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-[9px] uppercase font-bold border ${getStatusColor(hist.status)}`}>
                                            {hist.status}
                                        </span>
                                        <button className="p-2 text-white/30 hover:text-white bg-black rounded border border-white/10 hover:border-white/30 transition-colors">
                                            <Edit className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
