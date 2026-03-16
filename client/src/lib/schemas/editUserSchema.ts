import { z } from "zod";

export const createUpdateUserSchema = (isOfficer: boolean) =>
  z.object({
    username: z
      .string()
      .min(3, "Korisničko ime mora imati najmanje 3 karaktera.")
      .max(20, "Korisničko ime je predugo.")
      .regex(/^[a-zA-Z0-9_]+$/, "Dozvoljeni su samo slova, brojevi i donje crte."),

    firstName: z.string().min(2, "Ime je obavezno."),
    lastName: z.string().min(2, "Prezime je obavezno."),
    email: z.string().email("Neispravan email."),

    position: isOfficer
      ? z.string().min(2, "Pozicija je obavezna.")
      : z.string().optional().nullable(),

    municipalityId: isOfficer
      ? z.number({ message: "Opština je obavezna." })
      : z.number().optional().nullable(),
  });

