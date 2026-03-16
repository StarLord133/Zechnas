"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUserProfile = exports.toggleUserStatus = exports.generateResetLink = exports.deleteUser = exports.onUserDeleted = exports.inviteUser = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const zod_1 = require("zod");
admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();
const InviteUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    role: zod_1.z.enum(["ADMIN", "EMPLOYEE", "CLIENT"]),
    name: zod_1.z.string().optional(),
    department: zod_1.z.string().optional(),
    client_type: zod_1.z.enum(["INDIVIDUAL", "BUSINESS"]).optional(),
    employee_id: zod_1.z.string().optional(),
});
const DeleteUserSchema = zod_1.z.object({
    uid: zod_1.z.string(),
});
const GenerateLinkSchema = zod_1.z.object({
    email: zod_1.z.string().email()
});
const ToggleStatusSchema = zod_1.z.object({
    uid: zod_1.z.string(),
    disabled: zod_1.z.boolean()
});
const EditUserSchema = zod_1.z.object({
    uid: zod_1.z.string(),
    name: zod_1.z.string().optional(),
    department: zod_1.z.string().optional(),
});
exports.inviteUser = functions.https.onCall(async (data, context) => {
    // 1. Mandatory Security Check: Context Authentication & Claims
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
    }
    if (context.auth.token.role !== "ADMIN") {
        throw new functions.https.HttpsError("permission-denied", "Only ADMIN can invite users.");
    }
    // 2. Validate input schema directly (Zod)
    const parseResult = InviteUserSchema.safeParse(data);
    if (!parseResult.success) {
        throw new functions.https.HttpsError("invalid-argument", "Invalid payload payload.", parseResult.error);
    }
    const { email, role, client_type, employee_id, name, department } = parseResult.data;
    try {
        // 3. Create the user in Firebase Auth with a dummy password
        // Realistically you'd want generatePasswordResetLink instead of a dummy password on Production
        const randomTempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const userRecord = await auth.createUser({
            email,
            password: randomTempPassword,
        });
        const uid = userRecord.uid;
        // 4. Important: Set Custom Claims immediately
        await auth.setCustomUserClaims(uid, { role });
        // 5. Create the Firestore Mirror Document
        // Required import of FieldValue to fix undefined properties
        const { FieldValue } = require("firebase-admin/firestore");
        const userData = {
            uid,
            email,
            role,
            is_active: false,
            disabled: false,
            createdAt: FieldValue.serverTimestamp(),
        };
        if (name)
            userData.name = name;
        if (department)
            userData.department = department;
        if (role === "CLIENT") {
            if (!client_type) {
                // Rollback created user since he is missing require data
                await auth.deleteUser(uid);
                throw new functions.https.HttpsError("invalid-argument", "client_type is required for clients");
            }
            userData.client_type = client_type;
            if (employee_id) {
                userData.employee_id = employee_id;
            }
        }
        await db.collection("users").doc(uid).set(userData);
        // Provide a reset link so the user can choose their password and then become active
        const rawLink = await auth.generatePasswordResetLink(email);
        const urlObj = new URL(rawLink);
        const customLink = `https://zechnas-79bd2.web.app/auth/action${urlObj.search}`;
        return {
            success: true,
            uid,
            resetLink: customLink, // UI can email this, or function can use SendGrid here
            message: `User created with role ${role}`
        };
    }
    catch (error) {
        console.error("Error creating user", error);
        throw new functions.https.HttpsError("internal", error.message);
    }
});
// Cloud Function 2: Cleanup Routine
// Se dispara automáticamente en el backend de Google cuando eliminas un usuario desde la pestaña de Authentication
exports.onUserDeleted = functions.auth.user().onDelete(async (user) => {
    try {
        const uid = user.uid;
        console.log(`Borrando el rastro criptográfico en Firestore del usuario eliminado: ${uid}`);
        // Buscamos y destruimos la colección "users" atada al UID
        await db.collection("users").doc(uid).delete();
        console.log(`Documento de usuario ${uid} destruido exitosamente.`);
    }
    catch (error) {
        console.error("Fallo crítico al sincronizar la eliminación en BBDD:", error);
    }
});
// Cloud Function 3: Delete User
exports.deleteUser = functions.https.onCall(async (data, context) => {
    if (!context.auth || context.auth.token.role !== "ADMIN") {
        throw new functions.https.HttpsError("permission-denied", "Unauthorized.");
    }
    const parseResult = DeleteUserSchema.safeParse(data);
    if (!parseResult.success) {
        throw new functions.https.HttpsError("invalid-argument", "Invalid payload.", parseResult.error);
    }
    const { uid } = parseResult.data;
    try {
        await auth.deleteUser(uid);
        // La function onUserDeleted se encargará de borrar el registro en Firestore automáticamente.
        return { success: true, message: "User deleted" };
    }
    catch (error) {
        throw new functions.https.HttpsError("internal", error.message);
    }
});
// Cloud Function 3.5: Generar Nuevo Link de Invitacion 
exports.generateResetLink = functions.https.onCall(async (data, context) => {
    if (!context.auth || context.auth.token.role !== "ADMIN") {
        throw new functions.https.HttpsError("permission-denied", "Unauthorized.");
    }
    const parseResult = GenerateLinkSchema.safeParse(data);
    if (!parseResult.success) {
        throw new functions.https.HttpsError("invalid-argument", "Invalid payload.", parseResult.error);
    }
    try {
        const rawLink = await auth.generatePasswordResetLink(parseResult.data.email);
        const urlObj = new URL(rawLink);
        const customLink = `https://zechnas-79bd2.web.app/auth/action${urlObj.search}`;
        return { success: true, link: customLink };
    }
    catch (e) {
        throw new functions.https.HttpsError("internal", "Could not generate link");
    }
});
// Cloud Function 4: Toggle Status
exports.toggleUserStatus = functions.https.onCall(async (data, context) => {
    if (!context.auth || context.auth.token.role !== "ADMIN") {
        throw new functions.https.HttpsError("permission-denied", "Unauthorized.");
    }
    const parseResult = ToggleStatusSchema.safeParse(data);
    if (!parseResult.success) {
        throw new functions.https.HttpsError("invalid-argument", "Invalid payload.", parseResult.error);
    }
    const { uid, disabled } = parseResult.data;
    try {
        await auth.updateUser(uid, { disabled });
        await db.collection("users").doc(uid).update({ disabled });
        return { success: true };
    }
    catch (error) {
        throw new functions.https.HttpsError("internal", error.message);
    }
});
// Cloud Function 5: Edit Profile
exports.editUserProfile = functions.https.onCall(async (data, context) => {
    if (!context.auth || context.auth.token.role !== "ADMIN") {
        throw new functions.https.HttpsError("permission-denied", "Unauthorized.");
    }
    const parseResult = EditUserSchema.safeParse(data);
    if (!parseResult.success) {
        throw new functions.https.HttpsError("invalid-argument", "Invalid payload.", parseResult.error);
    }
    const { uid, name, department } = parseResult.data;
    try {
        const updateData = {};
        if (name)
            updateData.name = name;
        if (department)
            updateData.department = department;
        if (Object.keys(updateData).length > 0) {
            await db.collection("users").doc(uid).update(updateData);
        }
        if (name) {
            await auth.updateUser(uid, { displayName: name });
        }
        return { success: true };
    }
    catch (error) {
        throw new functions.https.HttpsError("internal", error.message);
    }
});
//# sourceMappingURL=index.js.map