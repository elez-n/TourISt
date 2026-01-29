import { z } from "zod";

// Regularni izraz za telefon (npr. +387 66 123 456)
const phoneRegex = /^(\+?\d{1,3})?\s?\d{2,3}\s?\d{3}\s?\d{3,4}$/;

export const touristObjectSchema = z.object({
  name: z.string().min(2, "Naziv mora imati najmanje 2 karaktera"),
  objectTypeId: z.number().int().positive("Odaberi tip objekta"),
  status: z.boolean(),
  address: z.string().min(5, "Adresa mora biti unesena"),
  coordinate1: z.number()
    .min(-90, "Latitude mora biti između -90 i 90")
    .max(90, "Latitude mora biti između -90 i 90")
    .optional(),
  coordinate2: z.number()
    .min(-180, "Longitude mora biti između -180 i 180")
    .max(180, "Longitude mora biti između -180 i 180")
    .optional(),
  contactPhone: z.string().regex(phoneRegex, "Neispravan broj telefona"),
  contactEmail: z.string().email("Neispravan email"),
  numberOfUnits: z.number().int().min(1, "Mora imati barem 1 jedinicu"),
  numberOfBeds: z.number().int().min(1, "Mora imati barem 1 krevet"),
  description: z.string().min(10, "Opis mora imati najmanje 10 karaktera"),
  owner: z.string().min(2, "Ime vlasnika mora biti uneseno"),
  featured: z.boolean(),
  categoryId: z.number().int().positive("Odaberi kategoriju"),
  municipalityId: z.number().int().positive("Odaberi opštinu"),
  additionalServiceIds: z.array(z.number().int().positive()).optional(),
 photographs: z
  .array(z.instanceof(File))
  .max(10, "Maksimalno 10 fotografija")
  .optional(),

});

export type TouristObjectSchema = z.infer<typeof touristObjectSchema>;
