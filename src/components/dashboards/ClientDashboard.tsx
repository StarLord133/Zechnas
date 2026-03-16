import { Download, FileText, CheckCircle2, Clock, Calendar, ShieldCheck, Mail, AlertTriangle, FileSpreadsheet } from "lucide-react";

// Mock Data
const CURRENT_MONTH = {
    month: "Marzo 2026",
    status: "ESPERANDO PAGO",
    deadline: "17 de Abril, 2026",
    isr: 14500,
    iva: 8200,
    notes: "A favor: $2,100 MXN en retenciones aplicados a ISR este periodo.",
    filesAvailable: true
};

const HISTORIC_DATA = [
    { period: "Febrero 2026", status: "Pagado", total: 19400, files: 2 },
    { period: "Enero 2026", status: "Pagado", total: 21000, files: 2 },
    { period: "Diciembre 2025", status: "Declaración Anual", total: 0, files: 1, type: "anual" },
    { period: "Noviembre 2025", status: "Pagado", total: 18500, files: 2 },
];

const PROFILE = {
    rfc: "XAXX010101000",
    regimen: "Régimen Simplificado de Confianza (RESICO)",
    activeDesde: "12 Mar 2024",
    email: "cliente@empresa.com"
};

const ProgressBar = ({ status }: { status: string }) => {
    let step = 1;
    if (status === "ESPERANDO PAGO") step = 2;
    if (status === "FINALIZADO") step = 3;

    return (
        <div className="w-full mt-6 mb-2">
            <div className="flex justify-between relative mb-2">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full z-0 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#D4AF37] to-yellow-200 transition-all duration-1000 rounded-full" style={{ width: step === 1 ? '10%' : step === 2 ? '50%' : '100%' }}></div>
                </div>
                
                <div className="z-10 bg-black p-1 rounded-full relative group">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-black ${step >= 1 ? 'bg-[#D4AF37] text-black shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-white/20 text-white/50'}`}>
                        <Clock className="w-3 h-3" />
                    </div>
                </div>
                
                <div className="z-10 bg-black p-1 rounded-full relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-black ${step >= 2 ? 'bg-[#D4AF37] text-black shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-white/20 text-white/50'}`}>
                        <FileText className="w-3 h-3" />
                    </div>
                </div>

                <div className="z-10 bg-black p-1 rounded-full relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-black ${step >= 3 ? 'bg-green-400 text-black shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-white/20 text-white/50'}`}>
                        <CheckCircle2 className="w-3 h-3" />
                    </div>
                </div>
            </div>
            
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-white/40">
                <span className={step >= 1 ? 'text-white' : ''}>En Despacho</span>
                <span className={step >= 2 ? 'text-white text-center' : 'text-center'}>Esperando Pago</span>
                <span className={step >= 3 ? 'text-green-400 text-right' : 'text-right'}>Finalizado</span>
            </div>
        </div>
    );
}


export const ClientDashboard = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
            
            {/* Header Client */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 bg-gradient-to-r from-[#111] to-black p-6 rounded-xl border border-white/5 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tighter">Mi Bóveda Fiscal</h2>
                    <p className="text-[#D4AF37] text-xs mt-2 tracking-widest uppercase font-mono flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Conexión Cifrada • Zechnas Firm
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Periodo en Curso</p>
                        <p className="text-white font-mono">{CURRENT_MONTH.month}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Panel Central: OBLIGACIÓN PRINCIPAL */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tarjeta de Resumen Actual */}
                    <div className="p-8 rounded-xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#1a1814] to-black shadow-[0_0_30px_rgba(212,175,55,0.05)] relative overflow-hidden">
                        
                        {/* Background Accents */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div>
                                <h3 className="text-white text-xs uppercase tracking-widest font-bold flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-4 h-4 text-yellow-500" /> Resumen de Impuestos
                                </h3>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-wider">
                                    {CURRENT_MONTH.status}
                                </div>
                            </div>
                            
                            <div className="text-right bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Fecha Límite</p>
                                <p className="text-white text-xs font-mono flex items-center justify-end gap-1"><Calendar className="w-3 h-3 text-red-400"/> {CURRENT_MONTH.deadline}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 mb-8 relative z-10 border-y border-white/10 py-6">
                            <div className="flex-1">
                                <p className="text-white/50 text-xs uppercase font-bold tracking-widest mb-2">Total a Pagar (MXN)</p>
                                <h2 className="text-5xl font-bold text-white tracking-tighter">
                                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(CURRENT_MONTH.isr + CURRENT_MONTH.iva)}
                                </h2>
                            </div>
                            <div className="flex gap-8 justify-start md:justify-end items-end pb-1 font-mono text-sm">
                                <div>
                                    <p className="text-white/40 text-[10px] uppercase mb-1">ISR</p>
                                    <p className="text-white/80">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(CURRENT_MONTH.isr)}</p>
                                </div>
                                <div className="w-px h-8 bg-white/10"></div>
                                <div>
                                    <p className="text-white/40 text-[10px] uppercase mb-1">IVA</p>
                                    <p className="text-white/80">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(CURRENT_MONTH.iva)}</p>
                                </div>
                            </div>
                        </div>

                        {CURRENT_MONTH.notes && (
                            <div className="mb-6 p-4 rounded-lg bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-white/70 text-sm relative z-10">
                                <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-1">Nota de tu Contador</p>
                                {CURRENT_MONTH.notes}
                            </div>
                        )}

                        <ProgressBar status={CURRENT_MONTH.status} />

                        {CURRENT_MONTH.filesAvailable && (
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                <button className="flex items-center justify-between p-4 bg-white text-black hover:bg-[#D4AF37] rounded-lg transition-colors font-bold group">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-black/10 p-2 rounded">
                                            <FileText className="w-5 h-5 text-black" />
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-sm uppercase tracking-widest">Línea de Captura</span>
                                            <span className="block text-[10px] opacity-60">Formato Bancario PDF</span>
                                        </div>
                                    </div>
                                    <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                                </button>

                                <button className="flex items-center justify-between p-4 bg-black border border-white/20 text-white hover:border-[#D4AF37] hover:text-[#D4AF37] rounded-lg transition-colors font-bold group">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/5 p-2 rounded group-hover:bg-[#D4AF37]/10 transition-colors">
                                            <FileSpreadsheet className="w-5 h-5 text-white/50 group-hover:text-[#D4AF37]" />
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-sm uppercase tracking-widest">Estado Financiero</span>
                                            <span className="block text-[10px] opacity-40">Reporte Mensual PDF</span>
                                        </div>
                                    </div>
                                    <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Historial Fiscal */}
                    <div className="p-6 rounded-xl border border-white/5 bg-[#0a0a0a]">
                        <h3 className="text-white text-sm uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-white/50" /> Bóveda Histórica
                        </h3>
                        <div className="overflow-hidden rounded-lg border border-white/5">
                            <table className="w-full text-sm text-left">
                                <thead className="text-[10px] uppercase text-white/40 bg-white/5 border-b border-white/5">
                                    <tr>
                                        <th className="py-4 px-4 font-medium tracking-widest">Periodo</th>
                                        <th className="py-4 px-4 font-medium tracking-widest text-center">Estatus</th>
                                        <th className="py-4 px-4 font-medium tracking-widest text-right">Impuestos</th>
                                        <th className="py-4 px-4 font-medium tracking-widest text-right">Archivos</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 bg-black">
                                    {HISTORIC_DATA.map((row, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                                            <td className="py-4 px-4">
                                                <span className={`font-medium ${row.type === 'anual' ? 'text-[#D4AF37]' : 'text-white'}`}>{row.period}</span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`px-2 py-1 inline-block rounded text-[9px] uppercase font-bold border ${
                                                    row.status === 'Pagado' ? 'text-green-400 border-green-400/20 bg-green-400/5' : 'text-[#D4AF37] border-[#D4AF37]/20 bg-[#D4AF37]/5'
                                                }`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-right font-mono text-white/70">
                                                {row.total ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(row.total) : 'N/A'}
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <button className="text-white/40 hover:text-white transition-colors flex items-center justify-end gap-1 w-full">
                                                    <span className="text-[10px] border border-white/10 px-1.5 rounded">{row.files}x</span>
                                                    <Download className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: PERFIL */}
                <div className="space-y-6">
                    <div className="p-6 rounded-xl border border-white/5 bg-[#0a0a0a]">
                        <h3 className="text-white text-sm uppercase tracking-widest font-bold mb-6">Identidad Fiscal</h3>
                        <div className="space-y-5">
                            <div>
                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">RFC</p>
                                <p className="text-white font-mono tracking-widest bg-white/5 p-2 rounded border border-white/5">{PROFILE.rfc}</p>
                            </div>
                            <div className="pt-2 border-t border-white/5">
                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Régimen</p>
                                <p className="text-white/80 text-xs leading-relaxed">{PROFILE.regimen}</p>
                            </div>
                            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Correo de Contacto</p>
                                <p className="text-white/80 text-xs flex items-center gap-1"><Mail className="w-3 h-3 text-white/30" /> {PROFILE.email}</p>
                            </div>
                            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Cliente Desde</p>
                                <p className="text-white/80 text-xs">{PROFILE.activeDesde}</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                           <p className="text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">
                               Zechnas no es un portal de pagos. Acuda a su sucursal bancaria o portal bancario online con la Línea de Captura provista.
                           </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
