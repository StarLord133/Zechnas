import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase/config";
import { useState } from "react";
import { Lock, Mail, ArrowRight } from "lucide-react";

// Estricto Zod Infer para la vista
const LoginSchema = z.object({
    email: z.string().email("Correo Corporativo requerido"),
    password: z.string().min(8, "La credencial es de 8 o más caracteres"),
});

type LoginForm = z.infer<typeof LoginSchema>;

export const Login = () => {
    const navigate = useNavigate();
    const [globalError, setGlobalError] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setGlobalError(null);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);

            // Forzar recarga del token (Garantiza lectura de Claims actualizada)
            const token = await userCredential.user.getIdTokenResult(true);
            const role = token.claims.role;

            // Transicionar orgánicamente de "Pendiente" a "Activo" en Vault al autenticarse
            const { doc, updateDoc } = await import("firebase/firestore");
            const { db } = await import("../../lib/firebase/config");
            await updateDoc(doc(db, "users", userCredential.user.uid), { status: "Activo" });

            if (role) navigate('/dashboard');
            else throw new Error("Credencial huérfana. No hay rol asignado. Contacte a soporte de Nivel 3.");

        } catch (err: any) {
            console.error("Fallo de Autenticación:", err);
            // Evitamos enumeración de errores. "Credenciales Inválidas" en The Source Code es el estándar.
            setGlobalError("Credenciales Inválidas u Operación Rechazada por el Entorno.");
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
            <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
                {/* Header Auth */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold tracking-tighter text-white">
                        Zechnas <span className="text-[#D4AF37]">.</span>
                    </h1>
                    <p className="text-white/40 mt-3 text-sm tracking-widest uppercase">Portal de Acceso Restringido</p>
                </div>

                {/* Form Card */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                    {globalError && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start gap-3">
                            <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p>{globalError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-white/50 uppercase tracking-widest pl-1">Identificador Fiscal</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-white/30" />
                                </div>
                                <input
                                    {...register("email")}
                                    type="email"
                                    className="w-full pl-11 pr-4 py-3 bg-black border border-white/10 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all text-white placeholder-white/20"
                                    placeholder="usuario@zechnas.com"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 pl-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-white/50 uppercase tracking-widest pl-1">Llave Criptográfica</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-white/30" />
                                </div>
                                <input
                                    {...register("password")}
                                    type="password"
                                    className="w-full pl-11 pr-4 py-3 bg-black border border-white/10 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all text-white placeholder-white/20 tracking-widest"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-xs text-red-500 pl-1">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full group bg-white text-black hover:bg-[#D4AF37] font-bold py-3.5 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <span className="animate-pulse">Validando Autenticidad...</span>
                            ) : (
                                <>
                                    <span>Ingresar a la Bóveda</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Auth */}
                <div className="text-center mt-8">
                    <p className="text-white/30 text-xs font-mono">Zechnas Firm © {new Date().getFullYear()} • Conexión Cifrada SSL</p>
                </div>
            </div>
        </div>
    );
}
