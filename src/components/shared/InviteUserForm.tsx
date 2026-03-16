import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { cloudFunctions } from "../../lib/firebase/config";
import { CheckCircle2, Copy } from "lucide-react";

// Zod Schema atado a la Cloud Function Invocada
const FormSchema = z.object({
    email: z.string().email("Correo Corporativo requerido"),
    role: z.enum(["ADMIN", "EMPLOYEE", "CLIENT"]),
    client_type: z.enum(["INDIVIDUAL", "BUSINESS"]).optional(),
    employee_id: z.string().optional(),
}).refine(data => {
    if (data.role === "CLIENT" && !data.client_type) return false;
    return true;
}, { message: "El tipo de cliente es obligatorio si el rol es CLIENT.", path: ["client_type"] });

type InviteFormType = z.infer<typeof FormSchema>;

// Mock para Select de Empleados. Esto sería consultado de la colección `users` en Firestore `where('role', '==', 'EMPLOYEE')`
const mockEmployees = [
    { uid: "emp1", email: "operador1@zechnas.com" },
    { uid: "emp2", email: "operador2@zechnas.com" }
];

export const InviteUserForm = () => {
    const [loading, setLoading] = useState(false);
    const [successLink, setSuccessLink] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<InviteFormType>({
        resolver: zodResolver(FormSchema),
        defaultValues: { role: "CLIENT" }
    });

    const selectedRole = watch("role");

    const onSubmit = async (data: InviteFormType) => {
        setLoading(true);
        setErrorMsg(null);
        setSuccessLink(null);

        // Invocamos la callable declarada en functions/src/index.ts
        const inviteUserCommand = httpsCallable<{ email: string, role: string, client_type?: string, employee_id?: string }, { resetLink: string, uid: string }>(cloudFunctions, "inviteUser");

        try {
            const response = await inviteUserCommand({
                ...data
            });
            setSuccessLink(response.data.resetLink);
            reset();
        } catch (error: any) {
            console.error("Payload rechazado por servidor:", error);
            setErrorMsg(error.message || "Audita el estado de la Cloud Function.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Invitar Nuevo Usuario</h2>

            {errorMsg && <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 rounded text-sm mb-4">{errorMsg}</div>}
            {successLink ? (
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] p-4 rounded-lg text-sm mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                        <p className="font-bold">Usuario Creado. Custom Claim asignado correctamente.</p>
                    </div>
                    <div className="bg-black/50 border border-[#D4AF37]/20 rounded-md p-3 relative group">
                        <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]/70 font-bold mb-1">Enlace Criptográfico de Establecimiento</p>
                        <div className="flex gap-2 items-center">
                           <input 
                               readOnly 
                               value={successLink}
                               className="bg-transparent border-none text-white/90 text-xs w-full focus:outline-none focus:ring-0 truncate font-mono"
                           />
                           <button 
                               onClick={(e) => {
                                   e.preventDefault();
                                   navigator.clipboard.writeText(successLink);
                               }}
                               className="p-2 border border-[#D4AF37]/30 bg-[#D4AF37]/10 rounded hover:bg-[#D4AF37]/20 hover:text-white text-[#D4AF37] transition-colors flex-shrink-0"
                               title="Copiar Enlace"
                           >
                                <Copy className="w-4 h-4" />
                           </button>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button type="button" onClick={() => setSuccessLink(null)} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition font-medium border border-slate-600">Cerrar</button>
                    </div>
                </div>
            ) : (
                <>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-300">Correo Electrónico a Invitar</label>
                            <input
                                {...register("email")}
                                type="email"
                                className="mt-1 w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-300">Rol Sistema (RBAC)</label>
                            <select
                                {...register("role")}
                                className="mt-1 w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                            >
                                <option value="CLIENT">Cliente</option>
                                <option value="EMPLOYEE">Empleado Operativo</option>
                                <option value="ADMIN">Administrador Zechnas</option>
                            </select>
                        </div>

                        {selectedRole === "CLIENT" && (
                            <>
                                <div className="pt-2 border-t border-slate-800">
                                    <label className="text-sm font-medium text-slate-300">Estructura Legal (Solo Clientes)</label>
                                    <div className="mt-2 flex gap-4">
                                        <label className="flex items-center space-x-2 text-sm text-slate-300">
                                            <input {...register("client_type")} type="radio" value="INDIVIDUAL" className="text-green-500 focus:ring-green-500 bg-slate-950" />
                                            <span>Persona Física</span>
                                        </label>
                                        <label className="flex items-center space-x-2 text-sm text-slate-300">
                                            <input {...register("client_type")} type="radio" value="BUSINESS" className="text-green-500 focus:ring-green-500 bg-slate-950" />
                                            <span>Persona Moral</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="text-sm font-medium text-slate-300">Asignar a Empleado (Para RLS de Lectura)</label>
                                    <select
                                        {...register("employee_id")}
                                        className="mt-1 w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                                    >
                                        <option value="">Sin asginar por ahora</option>
                                        {mockEmployees.map(e => <option key={e.uid} value={e.uid}>{e.email}</option>)}
                                    </select>
                                </div>
                            </>
                        )}

                        {errors.client_type && <p className="text-xs text-red-500 mt-1">{errors.client_type.message}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg transition-all disabled:opacity-50 border border-slate-600"
                        >
                            {loading ? "Inyectando Credencial..." : "Generar Invitación y Claims"}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};
