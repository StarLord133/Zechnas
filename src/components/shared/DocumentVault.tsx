import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase/config";
import { useAuth } from "../../hooks/useAuth";

interface DocIndex {
    id: string;
    filename: string;
    url: string;
    uploadedAt: unknown;
    type: string;
    year: string;
    month: string;
}

export const DocumentVault = () => {
    const { appUser } = useAuth();
    const [docs, setDocs] = useState<DocIndex[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!appUser?.uid) return;

        let q;
        const docsRef = collection(db, "documents_index");

        // Dynamic Vault Query enforcing RLS mapping
        if (appUser.role === 'CLIENT') {
            q = query(docsRef, where("clientId", "==", appUser.uid), orderBy("uploadedAt", "desc"));
        } else if (appUser.role === 'EMPLOYEE') {
            q = query(docsRef, where("employee_id", "==", appUser.uid), orderBy("uploadedAt", "desc"));
        } else {
            // ADMIN sees all (or can add filters in UI later)
            q = query(docsRef, orderBy("uploadedAt", "desc"));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as DocIndex[];
            setDocs(fetched);
            setLoading(false);
        }, (err) => {
            console.error("Vulnerabilidad o Rechazo de Lectura:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [appUser]);

    if (loading) return <div className="animate-pulse h-32 bg-slate-800 rounded-xl"></div>;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Bóveda Documental Compartida</h2>
                <span className="text-xs font-mono text-green-400 bg-green-500/10 px-2 py-1 rounded">Cifrado E2E Activo</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950/50 text-xs uppercase font-mono text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-medium">Archivo</th>
                            <th className="px-6 py-4 font-medium">Periodo</th>
                            <th className="px-6 py-4 font-medium">Tipo</th>
                            <th className="px-6 py-4 font-medium">Operación</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {docs.map(doc => (
                            <tr key={doc.id} className="hover:bg-slate-800/20 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs">{doc.filename}</td>
                                <td className="px-6 py-4">{doc.month}/{doc.year}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${doc.type === 'FACTURA' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                            doc.type === 'ACUSE' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                                'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        }`}>
                                        {doc.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-500 hover:text-green-400 font-medium text-xs tracking-wider uppercase flex items-center gap-1"
                                    >
                                        Descargar Seguro
                                    </a>
                                </td>
                            </tr>
                        ))}
                        {docs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-mono text-xs">
                                    Bóveda Vacía o Acceso Restringido Mapeado
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
