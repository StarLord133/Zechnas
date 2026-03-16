import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { storage, db } from "../../lib/firebase/config";
import { FileUploadSchema } from "../../lib/schemas";


// Se omite 'file' del schema del form base porque RHF maneja los FileList distinto. 
// Validaremos en el submiter.
const FormBaseSchema = z.object({
    year: z.string().regex(/^\d{4}$/, "Año inválido (ej. 2024)"),
    month: z.string().regex(/^(0[1-9]|1[0-2])$/, "Mes inválido (01-12)"),
    type: z.enum(["FACTURA", "ACUSE", "REPORTE"]),
    rfc: z.string().regex(/^[A-Z0-9]{12,13}$/, "Formato RFC Inválido"),
});

type FormBaseType = z.infer<typeof FormBaseSchema>;

export const DocumentUpload = () => {
    const { appUser } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormBaseType>({
        resolver: zodResolver(FormBaseSchema)
    });

    const onSubmit = async (data: FormBaseType) => {
        setMsg(null);

        if (!appUser?.uid) return setMsg({ type: 'error', text: 'Error fatal de sesión. Vuelva a autenticarse.' });
        if (!file) return setMsg({ type: 'error', text: 'Seleccione un documento PDF o XML.' });

        // Validación Zod Total (Incluyendo archivo) antes de ir a Storage
        const parseResult = FileUploadSchema.safeParse({
            ...data,
            clientId: appUser.uid,
            file: file
        });

        if (!parseResult.success) {
            return setMsg({ type: 'error', text: parseResult.error.issues[0].message });
        }

        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext !== 'pdf' && ext !== 'xml') return setMsg({ type: 'error', text: 'El formato de archivo está estrictamente limitado a .pdf y .xml' });

        // Strict Naming Convention dictated by storage.rules
        const strictFilename = `${data.rfc}_${data.month}_${data.year}_${data.type}.${ext}`;
        const storagePath = `clients/${appUser.uid}/docs/${data.year}/${data.month}/${strictFilename}`;

        setLoading(true);

        try {
            const fileRef = ref(storage, storagePath);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);

            // We insert into an index for faster queries without parsing storage trees.
            const docId = `${appUser.uid}_${strictFilename}`;
            await setDoc(doc(db, "documents_index", docId), {
                clientId: appUser.uid,
                year: data.year,
                month: data.month,
                type: data.type,
                rfc: data.rfc,
                filename: strictFilename,
                url,
                uploadedAt: serverTimestamp(),
                employee_id: appUser.role === 'CLIENT' ? appUser.employee_id : null // Mantener RLS de indice
            });

            setMsg({ type: 'success', text: 'El archivo ha sobrepasado los controles de seguridad y está almacenado en Vault.' });
            reset();
            setFile(null);

        } catch (error: Error | unknown) {
            console.error("Transacción Rechazada:", error);
            if (error instanceof Error) {
                setMsg({ type: 'error', text: "El sistema rechazó el archivo. Operación no autorizada (" + error.message + ")" });
            } else {
                setMsg({ type: 'error', text: "El sistema rechazó el archivo. Operación no autorizada." });
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">Subir Documento a Bóveda Criptográfica</h2>

            {msg && (
                <div className={`p-4 rounded mb-4 border text-sm font-mono ${msg.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-green-500/10 border-green-500/50 text-green-400'}`}>
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">RFC / Tax ID</label>
                        <input {...register("rfc")} className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded focus:border-green-500 text-slate-300 font-mono" placeholder="ABC123456T8" />
                        {errors.rfc && <p className="text-xs text-red-500 mt-1">{errors.rfc.message}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Tipo Dcto.</label>
                        <select {...register("type")} className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded focus:border-green-500 text-slate-300">
                            <option value="FACTURA">FACTURA (Ventas/Compras)</option>
                            {appUser?.role !== 'CLIENT' && <option value="ACUSE">ACUSE RECIBO (Only Admin/Emp)</option>}
                            <option value="REPORTE">REPORTE FINANCIERO</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Año Fiscal</label>
                        <input {...register("year")} className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded focus:border-green-500 text-slate-300 font-mono" placeholder="2024" />
                        {errors.year && <p className="text-xs text-red-500 mt-1">{errors.year.message}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Mes</label>
                        <input {...register("month")} className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded focus:border-green-500 text-slate-300 font-mono" placeholder="04" />
                        {errors.month && <p className="text-xs text-red-500 mt-1">{errors.month.message}</p>}
                    </div>
                </div>

                <div className="mt-4 border-2 border-dashed border-slate-800 rounded-lg p-6 text-center hover:border-green-500/50 transition-colors">
                    <input
                        type="file"
                        accept=".pdf,.xml"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="secure-upload"
                    />
                    <label htmlFor="secure-upload" className="cursor-pointer text-slate-400 text-sm">
                        {file ? <span className="text-green-400">{file.name} ({(file.size / 1024).toFixed(1)} KB)</span> : "Click para seleccionar Payload Local (.pdf / .xml)"}
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 uppercase tracking-widest text-xs font-bold py-3 rounded-lg border border-slate-700 transition-all font-mono"
                >
                    {loading ? "Cifrando & Transfiriendo..." : "Ejecutar Inserción de Vault"}
                </button>
            </form>
        </div>
    );
};
