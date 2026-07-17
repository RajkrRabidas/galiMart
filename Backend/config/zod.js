const z = require("zod");
const ROLES = require("../constants/roles");

const registerSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters long"),
  role: z.enum(Object.values(ROLES)).optional(),
});

const loginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters long"),
});

const completeProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  pinCode: z.string().min(1, "Pin code is required"),
  location: z
    .object({
      type: z.string().default("Point"),
      coordinates: z.array(z.number()).length(2),
    })
    .optional()
    .default({ type: "Point", coordinates: [0, 0] }),
});

const createShopSchema = z.object({
  name: z.string().trim().min(1, "Shop name is required"),
  description: z.string().trim().optional(),
  phone: z.coerce.number().int().positive("Phone number is required"),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  formatted: z.string().trim().optional(),
});

const updateShopSchema = z.object({
  name: z.string().trim().min(1, "Shop name is required").optional(),
  description: z.string().trim().optional(),
  phone: z.coerce.number().int().positive("Phone number is required").optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  formatted: z.string().trim().optional(),
});

const updateShopStatusSchema = z.object({
  status: z.boolean(),
});

module.exports = {
  registerSchema,
  loginSchema,
  completeProfileSchema,
  createShopSchema,
  updateShopSchema,
  updateShopStatusSchema,
};