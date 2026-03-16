const admin = require('firebase-admin');

// INSTRUCCIONES ESTRICTAS:
// 1. Ve a Firebase Console -> Project Settings -> Service Accounts
// 2. Haz clic en "Generate new private key".
// 3. Guarda el archivo .json descargado en esta misma carpeta y reescribe la ruta abajo.
// ¡NUNCA SUBAS ESTE ARCHIVO JSON A GITHUB. AGREGALO AL .GITIGNORE!
const serviceAccount = require('./firebase-adminsdk-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const setAdminClaim = async (uid) => {
    try {
        // 1. Inyectar el Custom Claim en Firebase Auth Token
        await admin.auth().setCustomUserClaims(uid, { role: 'ADMIN' });
        console.log(`[EXITO] - Se ha inyectado el claim { role: 'ADMIN' } al UID: ${uid}`);

        // 2. Verificar que se inyectó leyendo de Auth
        const userRecord = await admin.auth().getUser(uid);
        console.log(`[AUDITORÍA] - Claims actuales del usuario:`, userRecord.customClaims);

        // 3. Crear o Actualizar el Data Mirror en Firestore (Colección users) para coherencia visual.
        const db = admin.firestore();
        await db.collection('users').doc(uid).set({
            uid: uid,
            email: userRecord.email,
            role: 'ADMIN',
            is_active: true, // Asumimos que el Admin es activo
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        console.log(`[EXITO] - Documento creado/actualizado en Firestore: /users/${uid}`);

        process.exit(0);
    } catch (error) {
        console.error('[FALLO CATASTRÓFICO] - No se pudo procesar la inyección de seguridad:', error);
        process.exit(1);
    }
};

// ==========================================
// USO: Pega aquí el UID de tu cuenta "Admin" creada desde la consola de Firebase.
// ==========================================
const TARGET_ADMIN_UID = 'FVCX2yAXNBOmPUOpALoaJk7fIym2';

if (TARGET_ADMIN_UID === 'PEGA_AQUÍ_TU_UID') {
    console.error("Vulnerabilidad de uso: Debes reemplazar TARGET_ADMIN_UID con el UID real del usuario que será superadministrador.");
    process.exit(1);
}

setAdminClaim(TARGET_ADMIN_UID);
