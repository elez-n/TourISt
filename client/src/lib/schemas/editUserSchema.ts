import { z } from "zod";

export const createUpdateUserSchema = (isOfficer: boolean) =>
  z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username is too long")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscore allowed"),

    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email"),

    position: isOfficer
      ? z.string().min(2, "Position is required")
      : z.string().optional().nullable(),

    municipalityId: isOfficer
      ? z.number({ message: "Municipality is required" })
      : z.number().optional().nullable(),
  });

