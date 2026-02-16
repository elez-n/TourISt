// components/CreateOfficerForm.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useCreateOfficerMutation } from "@/store/api/adminApi"; // RTK Query mutation za oficire
import { useFetchMunicipalitiesQuery } from "@/store/api/TouristObjectApi";

// Zod schema za validaciju
const officerSchema = z.object({
  username: z.string().min(3, "Username mora imati barem 3 karaktera"),
  firstName: z.string().min(1, "Unesite ime"),
  lastName: z.string().min(1, "Unesite prezime"),
  email: z.string().email("Neispravan email"),
  position: z.string().min(1, "Unesite poziciju"),
  municipalityId: z.number().min(1, "Izaberite opštinu"),
});

export type OfficerFormSchema = z.infer<typeof officerSchema>;

const CreateOfficerForm = () => {
  const { data: municipalities = [], isLoading } = useFetchMunicipalitiesQuery();
  const [createOfficer] = useCreateOfficerMutation();
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OfficerFormSchema>({
    resolver: zodResolver(officerSchema),
    defaultValues: { municipalityId: 0 },
  });

  const onSubmit = async (data: OfficerFormSchema) => {
    try {
      await createOfficer(data).unwrap();
      setSuccessMessage("Oficir uspješno kreiran!");
      reset();
    } catch (err) {
      console.error(err);
      alert(err || "Došlo je do greške");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Kreiraj novog oficira</h2>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative">
          <Label className="text-xs text-gray-400">Ime</Label>
          <User className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
          <Input placeholder="Unesite ime" className="pl-10" {...register("firstName")} />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
        </div>

        <div className="relative">
          <Label className="text-xs text-gray-400">Prezime</Label>
          <User className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
          <Input placeholder="Unesite prezime" className="pl-10" {...register("lastName")} />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
        </div>

        <div className="relative">
          <Label className="text-xs text-gray-400">Email</Label>
          <Mail className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
          <Input type="email" placeholder="Unesite email" className="pl-10" {...register("email")} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="relative">
          <Label className="text-xs text-gray-400">Korisničko ime</Label>
          <User className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
          <Input placeholder="Unesite username" className="pl-10" {...register("username")} />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
        </div>

        <div className="relative">
          <Label className="text-xs text-gray-400">Pozicija</Label>
          <Input placeholder="Unesite poziciju" className="pl-3" {...register("position")} />
          {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
        </div>

        <div className="relative">
          <Label className="text-xs text-gray-400">Opština</Label>
          <select
            {...register("municipalityId", { valueAsNumber: true })}
            className="w-full border rounded-md p-2 mt-1"
            disabled={isLoading}
          >
            <option value={0}>Izaberite opštinu</option>
            {municipalities.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          {errors.municipalityId && <p className="text-red-500 text-xs mt-1">{errors.municipalityId.message}</p>}
        </div>

        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold" disabled={isSubmitting}>
          {isSubmitting ? "Kreiranje..." : "Kreiraj oficira"}
        </Button>

        {successMessage && <p className="text-green-500 mt-4 text-center">{successMessage}</p>}
      </form>
    </div>
  );
};

export default CreateOfficerForm;
