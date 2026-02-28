import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Mail, Briefcase, MapPin } from "lucide-react";
import logo from "@/assets/logooo.png";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useCreateOfficerMutation } from "@/store/api/adminApi";
import { useFetchMunicipalitiesQuery } from "@/store/api/TouristObjectApi";
import { useNavigate } from "react-router-dom";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const officerSchema = z.object({
  username: z.string().min(3, "Username mora imati barem 3 karaktera"),
  firstName: z.string().min(1, "Unesite ime"),
  lastName: z.string().min(1, "Unesite prezime"),
  email: z.string().email("Neispravan email"),
  position: z.string().min(1, "Unesite poziciju"),
  municipalityId: z.number().min(1, "Izaberite opštinu"),
});

type OfficerFormSchema = z.infer<typeof officerSchema>;

const CreateOfficerForm = () => {
  const navigate = useNavigate();
  const { data: municipalities = [], isLoading } = useFetchMunicipalitiesQuery();
  const [createOfficer] = useCreateOfficerMutation();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await createOfficer(data).unwrap();
      setSuccessMessage("Službenik uspješno kreiran!");
      reset();

      setTimeout(() => navigate("/users"), 1000);
    } catch (err: unknown) {
      let message = "Došlo je do greške prilikom kreiranja službenika.";

      if ((err as FetchBaseQueryError)?.status) {
        const fetchErr = err as FetchBaseQueryError;

        if ("data" in fetchErr && fetchErr.data) {
          if (typeof fetchErr.data === "string") {
            message = fetchErr.data;
          }
          else if (
            typeof fetchErr.data === "object" &&
            "message" in fetchErr.data
          ) {
            message = (fetchErr.data as { message: string }).message;
          }
        }
      }

      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-400 to-indigo-600 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-2 animate-fadeInUp">
        <div className="hidden md:flex flex-col justify-center items-center bg-[#272757] text-white p-10">
          <img src={logo} alt="Logo" className="w-64" />
          <p className="text-center text-indigo-100 max-w-xs mt-4">
            Dodajte službenika i dodijelite ga opštini unutar sistema.
          </p>
        </div>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Dodaj novog službenika
          </h2>

          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-center mb-4">{successMessage}</p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              <Label className="text-xs text-gray-400">Ime</Label>
              <User className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Unesite ime"
                className="pl-10"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Label className="text-xs text-gray-400">Prezime</Label>
              <User className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Unesite prezime"
                className="pl-10"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Label className="text-xs text-gray-400">Email</Label>
              <Mail className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
              <Input
                type="email"
                placeholder="Unesite email"
                className="pl-10"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Label className="text-xs text-gray-400">Korisničko ime</Label>
              <User className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Unesite username"
                className="pl-10"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Label className="text-xs text-gray-400">Pozicija</Label>
              <Briefcase className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Unesite poziciju"
                className="pl-10"
                {...register("position")}
              />
              {errors.position && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.position.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Label className="text-xs text-gray-400">Opština</Label>
              <MapPin className="absolute top-7 left-3 text-gray-400 h-5 w-5" />
              <select
                {...register("municipalityId", { valueAsNumber: true })}
                className="w-full border rounded-md pl-10 pr-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#5c5c99]"
                disabled={isLoading}
              >
                <option value={0}>Izaberite opštinu</option>
                {municipalities.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              {errors.municipalityId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.municipalityId.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#5c5c99]! hover:bg-[#272757]! text-white font-semibold hover:scale-105 transition-transform"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Kreiranje..." : "Kreiraj službenika"}
            </Button>
          </form>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default CreateOfficerForm;