import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "../../lib/firebase/config";
import { Lock, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";

const PasswordSchema = z.object({
    password: z.string().min(8, "Mínimo 8 caracteres para bóveda segura"),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Las claves criptográficas no coinciden",
    path: ["confirmPassword"],
});

type PasswordForm = z.infer<typeof PasswordSchema>;

export const AuthAction = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const mode = searchParams.get("mode");
    const actionCode = searchParams.get("oobCode");
    
    const [email, setEmail] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(true);
    const [isInvalidCode, setIsInvalidCode] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [globalError, setGlobalError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PasswordForm>({
        resolver: zodResolver(PasswordSchema),
    });

    useEffect(() => {
        if (!mode || !actionCode || mode !== 'resetPassword') {
            setIsInvalidCode(true);
            setIsValidating(false);
            return;
        }

        // Verificar validez del token al cargar la página
        verifyPasswordResetCode(auth, actionCode)
            .then((emailRes) => {
                setEmail(emailRes);
                setIsValidating(false);
            })
            .catch((e) => {
                console.error("Token expirado o inválido:", e);
                setIsInvalidCode(true);
                setIsValidating(false);
            });
    }, [mode, actionCode]);

    const onSubmit = async (data: PasswordForm) => {
        setGlobalError(null);
        if (!actionCode) return;
        
        try {
            await confirmPasswordReset(auth, actionCode, data.password);
            setSuccessMsg("Bóveda asegurada. Identidad Criptográfica actualizada con éxito.");
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            console.error("Fallo al restablecer:", err);
            setGlobalError("Rechazo del Firewall: El token ya fue consumido o expiró por seguridad.");
        }
    };

    if (isValidating) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
                <div className="text-white/40 animate-pulse text-sm uppercase tracking-widest font-bold">
                    Verificando Integridad del Link...
                </div>
            </div>
        );
    }

    if (isInvalidCode) {
        return (
            <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
                <h1 className="text-2xl font-bold text-white mb-2">Enlace Corrupto / Expirado</h1>
                <p className="text-white/40 text-center max-w-sm mb-8">
                    La clave de acción solicitada ya fue consumida, expiró o está malformada. Por protocolos de seguridad, contacte al Admin para generar una nueva firma espacial.
                </p>
                <button 
                    onClick={() => navigate('/login')}
                    className="border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 px-6 py-2 rounded text-sm uppercase font-bold tracking-widest transition-colors"
                >
                    Volver al Portal
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000000] flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500 space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <ShieldCheck className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white tracking-widest uppercase">
                        Establecer Credencial
                    </h1>
                    {email && (
                        <p className="text-white/40 text-sm">
                            Canal Cifrado para: <span className="text-white/70 font-mono">{email}</span>
                        </p>
                    )}
                </div>

                {/* Main Card */}
                {successMsg ? (
                    <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-xl p-8 text-center space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-[#D4AF37] mx-auto opacity-20 absolute top-4 right-4" />
                        <div className="mx-auto w-12 h-12 bg-[#D4AF37]/10 flex items-center justify-center rounded-full mb-4">
                            <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <h2 className="text-[#D4AF37] font-bold text-lg">{successMsg}</h2>
                        <p className="text-white/40 text-sm">Redirigiendo a tu panel de control maestro en 3 segundos...</p>
                    </div>
                ) : (
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-8 shadow-2xl relative overflow-hidden">
                        {globalError && (
                            <div className="mb-6 p-3 bg-red-950/30 border border-red-500/50 rounded-lg text-red-500 text-xs font-mono font-bold">
                                {globalError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                                    Nueva Clave Maestra
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#D4AF37] transition-colors" />
                                    <input
                                        {...register("password")}
                                        type="password"
                                        autoComplete="new-password"
                                        className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                                        placeholder="Min. 8 caracteres alfanuméricos"
                                    />
                                </div>
                                {errors.password && <p className="text-red-500 text-[10px] uppercase">{errors.password.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                                    Verificar Clave
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#D4AF37] transition-colors" />
                                    <input
                                        {...register("confirmPassword")}
                                        type="password"
                                        autoComplete="new-password"
                                        className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                                        placeholder="Repetir secuencia criptográfica"
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-[10px] uppercase">{errors.confirmPassword.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full group bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs py-3 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 relative overflow-hidden"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {isSubmitting ? "INMORTALIZANDO..." : "INICIALIZAR BÓVEDA"}
                                    {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </div>
                            </button>
                        </form>
                    </div>
                )}
            </div>
            {/* Footer Minimalista */}
            <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-bold mt-12 mb-4 text-center">
                Protocolo de Seguridad <br /> Firebase Auth <br /> Zero-Trust Architecture
            </p>
        </div>
    );
};
