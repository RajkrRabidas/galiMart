const z = require("zod");

const registerSchema = z.object({
    phone: z.string().min(10, "Phone number must be at least 10 characters long"),
    role: z.string().optional(),
})

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})

module.exports = {registerSchema, loginSchema}