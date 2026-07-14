const z = require("zod");

const registerSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters long"),
  role: z.string().optional(),
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

module.exports = { registerSchema, loginSchema, completeProfileSchema };