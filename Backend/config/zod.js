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
  formattedAddress: z.string().min(1, "Address is required").optional(),
  address: z.string().min(1, "Address is required").optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  pinCode: z.string().optional(),
  location: z
    .object({
      type: z.string().default("Point"),
      coordinates: z.array(z.number()).length(2),
    })
    .optional(),
}).superRefine((data, ctx) => {
  const addressValue = data.formattedAddress || data.address;

  if (!addressValue) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["formattedAddress"],
      message: "Address is required",
    });
  }

  if (data.latitude === undefined || data.longitude === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["latitude"],
      message: "Latitude and longitude are required",
    });
  }
});

const aadhaarNumberSchema = z.preprocess(
  (value) => {
    if (typeof value === "number") return value.toString();
    return value;
  },
  z.string().trim().regex(/^[0-9]{12}$/, "Aadhaar number must be 12 digits"),
);

const createShopSchema = z.object({
  name: z.string().trim().min(1, "Shop name is required"),
  description: z.string().trim().optional(),
  phone: z.coerce.number().int().positive("Phone number is required"),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  formattedAddress: z.string().trim().optional(),
  aadharNumber: aadhaarNumberSchema,
});

const updateShopSchema = z.object({
  name: z.string().trim().min(1, "Shop name is required").optional(),
  description: z.string().trim().optional(),
  phone: z.coerce.number().int().positive("Phone number is required").optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  formattedAddress: z.string().trim().optional(),
  aadharNumber: aadhaarNumberSchema.optional(),
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