import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase/config";
import { UserSchema } from "../lib/schemas"; // Our strict User Type from Zod
import type { User as AppUser } from "../lib/schemas";

// Extending Firebase User interface temporarily within the context
// to securely hold the Custom Claim role and the Firestore snapshot
interface AuthContextType {
    firebaseUser: FirebaseUser | null;
    appUser: AppUser | null;
    role: AppUser["role"] | null;
    isLoading: boolean;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    const [role, setRole] = useState<AppUser["role"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Escuchador Central - Cero Polling
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (!user) {
                    setFirebaseUser(null);
                    setAppUser(null);
                    setRole(null);
                    return;
                }

                // 1. Validar Token y Obtener Claims (The Source of Truth)
                const tokenResult = await user.getIdTokenResult();
                const userRole = tokenResult.claims.role as AppUser["role"];

                if (!userRole) {
                    console.error("Seguridad: Usuario autenticado pero sin Custom Claim (Rol). Posible estado de carrera en registro.");
                    // En un entorno extremo, se forzaría signOut aquí.
                }

                // 2. Obtener el 'Espejo' visual de Firestore (Seguro porque las reglas lo permiten)
                const userDocRef = doc(db, "users", user.uid);
                const userSnapshot = await getDoc(userDocRef);

                let validAppUser: AppUser | null = null;

                if (userSnapshot.exists()) {
                    // El Parseo Estricto (De vuelta a Zod) de los datos recuperados
                    const parseResult = UserSchema.safeParse({ ...userSnapshot.data(), uid: user.uid });

                    if (parseResult.success) {
                        validAppUser = parseResult.data;
                    } else {
                        console.error("Vulnerabilidad o Inconsistencia Detectada en BD: Documento del usuario no coincide con su Esquema.", parseResult.error);
                        // Reportar a Sentry o DataDog idealmente
                    }
                } else {
                    console.error("Arquitectura: Documento del usuario no encontrado en /users/");
                }

                setFirebaseUser(user);
                setRole(userRole || validAppUser?.role || null); // Fallback al documento si el claim tarda, aunque claim tiene prioridad
                setAppUser(validAppUser);

            } catch (error) {
                console.error("Fallo Catastrófico en la Hidratación de Sesión:", error);
                setFirebaseUser(null);
                setAppUser(null);
                setRole(null);
            } finally {
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ firebaseUser, appUser, role, isLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// useAuth moved to src/hooks/useAuth.ts
