import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "../object-details/Modal";
import { useFetchMunicipalitiesQuery } from "@/store/api/TouristObjectApi";
import { useUpdateUserMutation } from "@/store/api/adminApi";
import type { UserInfoDto, UpdateUserDto } from "@/store/types/User";
import { createUpdateUserSchema } from "@/lib/schemas/editUserSchema";
import { z } from "zod";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserInfoDto | null;
}

export const EditUserModal: React.FC<Props> = ({ isOpen, onClose, user }) => {
  const isOfficer = user?.role === "Officer";
  const schema = createUpdateUserSchema(!!isOfficer);
  type FormValues = z.infer<typeof schema>;

  const { data: municipalities, isLoading: isLoadingMunicipalities } = useFetchMunicipalitiesQuery();
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      position: "",
      municipalityId: undefined,
    },
  });

  useEffect(() => {
    if (!user) return;

    if (isOfficer && !municipalities) return;

    reset({
      username: user.username ?? "",
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      position: isOfficer ? user.position ?? "" : undefined,
      municipalityId: isOfficer ? user.municipalityId ?? undefined : undefined,
    });
  }, [user, municipalities, reset, isOfficer]);

  const onSubmit = async (data: FormValues) => {
    if (!user) return;

    try {
      await updateUser({
        id: user.id,
        data: {
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          ...(isOfficer && {
            position: data.position,
            municipalityId: data.municipalityId,
          }),
        } as UpdateUserDto,
      }).unwrap();

      alert("Korisnik je uspješno ažuriran.");
      onClose();
    } catch {
      alert("Greška prilikom ažuriranja korisnika.");
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-semibold mb-6">Uredi korisnika</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input placeholder="Korisničko ime" {...register("username")} />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>

        <div>
          <Input placeholder="Ime" {...register("firstName")} />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>

        <div>
          <Input placeholder="Prezime" {...register("lastName")} />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
        </div>

        <div>
          <Input placeholder="Email adresa" {...register("email")} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {isOfficer && (
          <>
            <div>
              <Input placeholder="Pozicija" {...register("position")} />
              {errors.position && <p className="text-red-500 text-sm">{errors.position.message}</p>}
            </div>

            <div>
              {isLoadingMunicipalities ? (
                <p>Učitavanje opština...</p>
              ) : (
                <Controller
                  control={control}
                  name="municipalityId"
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full p-2 border rounded bg-white"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value ?? ""}
                    >
                      <option value="">Odaberi opštinu</option>
                      {municipalities?.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
              )}
              {errors.municipalityId && (
                <p className="text-red-500 text-sm">{errors.municipalityId.message}</p>
              )}
            </div>
          </>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Otkaži
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Čuvanje..." : "Sačuvaj izmjene"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
