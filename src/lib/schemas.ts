import { z } from "zod";

export const RoleSchema = z.enum(["ADMIN", "EMPLOYEE", "CLIENT"]);

export const ClientTypeSchema = z.enum(["INDIVIDUAL", "BUSINESS"]);

export const UserSchema = z.object({
    uid: z.string().min(1),
    email: z.string().email(),
    role: RoleSchema,
    is_active: z.boolean().default(false),
    client_type: ClientTypeSchema.optional(), // Only applicable if role === "CLIENT"
    employee_id: z.string().optional(), // If role === "CLIENT", this maps him to an employee
    createdAt: z.any().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const FileUploadSchema = z.object({
    file: z.instanceof(File).refine((f) => f.size < 5 * 1024 * 1024, "Max file size is 5MB"),
    clientId: z.string(),
    year: z.string().regex(/^\d{4}$/),
    month: z.string().regex(/^(0[1-9]|1[0-2])$/),
    type: z.enum(["FACTURA", "ACUSE", "REPORTE"]),
    rfc: z.string().regex(/^[A-Z0-9]{12,13}$/, "Formato RFC Inválido"),
});

// RFC_MES_AÑO_TIPO.pdf
// Ejemplo validator logic: `${rfc}_${month}_${year}_${type}.${ext}`
