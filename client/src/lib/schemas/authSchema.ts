import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
    lastName: z.string().min(2, "Prezime mora imati najmanje 2 karaktera"),
    email: z.string().email("Neispravan email"),
    username: z.string().min(3, "Username mora imati najmanje 3 karaktera"),
    password: z.string().min(6, "Lozinka mora imati najmanje 6 karaktera"),
    confirmPassword: z.string().min(6, "Potvrda lozinke je obavezna"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lozinke se ne poklapaju",
    path: ["confirmPassword"],
  });

export type SignupSchema = z.infer<typeof signupSchema>;
