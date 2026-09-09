import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100),
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  phone: z.string().optional().default(""),
});

export const orderSchema = z.object({
  clientId: z.string().min(1, "clientId requis"),
  clientName: z.string().min(1, "Nom requis"),
  clientEmail: z.string().email("Email invalide"),
  clientPhone: z.string().min(1, "Téléphone requis"),
  address: z.string().min(1, "Adresse requise"),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
    size: z.number().optional(),
    color: z.string().optional(),
  })).min(1, "Au moins un article requis"),
  total: z.number().positive(),
  shipping: z.number().min(0),
  paymentMethod: z.string().optional(),
  notes: z.string().optional().default(""),
});

export const orderStatusSchema = z.object({
  status: z.enum(["En attente", "Confirmée", "En cours", "Expédiée", "Livrée", "Annulée"]),
});

export const productSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(200),
  price: z.number().positive("Le prix doit être positif"),
  originalPrice: z.number().positive().nullable().optional(),
  category: z.string().min(1),
  sizes: z.array(z.number()).optional().default([]),
  colors: z.array(z.string()).optional().default([]),
  images: z.array(z.string()).optional().default([]),
  stock: z.number().int().min(0).optional().default(0),
  description: z.string().optional().default(""),
  material: z.string().optional().default(""),
  isNew: z.boolean().optional().default(false),
  isBestSeller: z.boolean().optional().default(false),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100),
  email: z.string().email("Email invalide"),
  subject: z.string().optional().default(""),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(2000),
});

export const newsletterSchema = z.object({
  email: z.string().email("Email invalide"),
});

export const favorisSchema = z.object({
  clientId: z.string().min(1, "clientId requis"),
  productId: z.string().min(1, "productId requis"),
});

export const adressesSchema = z.object({
  clientId: z.string().min(1, "clientId requis"),
  label: z.string().min(1, "Le label est requis").max(50),
  name: z.string().min(1, "Le nom est requis").max(100),
  phone: z.string().optional().default(""),
  address: z.string().min(1, "L'adresse est requise").max(200),
  city: z.string().optional().default("Abidjan"),
  isDefault: z.boolean().optional().default(false),
});

export const userUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().max(100).optional(),
  email: z.string().email("Email invalide").optional(),
  phone: z.string().max(20).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").optional(),
});

export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(body);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const issues = result.error.issues;
  const firstError = issues.length > 0 ? issues[0].message : "Erreur de validation";
  return { success: false, error: firstError };
}
