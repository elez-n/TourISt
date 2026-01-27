"use client";

import { useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import MapPicker from "@/components/MapPicker";

import { touristObjectSchema, type TouristObjectSchema } from "@/lib/schemas/touristObjectSchema";
import { useFetchObjectTypesQuery, useFetchCategoriesQuery, useFetchMunicipalitiesQuery, useCreateTouristObjectMutation, useFetchAdditionalServicesQuery } from "@/store/api/TouristObjectApi";

type Props = {
    setEditMode?: (value: boolean) => void;
    refetch?: () => void;
};

const MAX_IMAGES = 10;
const MAX_FILE_SIZE_MB = 5;

export default function TouristObjectForm({ setEditMode, refetch }: Props) {
    const { data: types } = useFetchObjectTypesQuery();
    const { data: categories } = useFetchCategoriesQuery();
    const { data: municipalities } = useFetchMunicipalitiesQuery();
    const { data: additionalServices } = useFetchAdditionalServicesQuery();

    const [createTouristObject, { isLoading }] = useCreateTouristObjectMutation();

    const { control, handleSubmit, register, reset, setValue, getValues, formState: { errors, isSubmitting } } =
        useForm<TouristObjectSchema>({
            resolver: zodResolver(touristObjectSchema),
            mode: "onTouched",
            defaultValues: {
                name: "",
                objectTypeId: 0,
                status: true,
                address: "",
                coordinate1: 44.0,
                coordinate2: 17.0,
                contactPhone: "",
                contactEmail: "",
                numberOfUnits: 1,
                numberOfBeds: 1,
                description: "",
                owner: "",
                featured: false,
                categoryId: 0,
                municipalityId: 0,
                additionalServiceIds: [],
                photographs: [] as File[],
            },
        });

    const round2 = (value: number) => Math.round(value * 100) / 100;
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- WATCH PHOTOS SAFELY ---
    const photos = useWatch({
        control,
        name: "photographs",
        defaultValue: [],
    }) as File[];

    // Derive previews with useMemo → nema setState u useEffect, uklanja ESLint warning
    const previews = useMemo(() => photos.map(file => ({ file, url: URL.createObjectURL(file) })), [photos]);

    const handleFiles = (files: FileList) => {
        const existing = getValues("photographs") || [];
        const incoming = Array.from(files)
            .filter(f => f.size <= MAX_FILE_SIZE_MB * 1024 * 1024 && f.type.startsWith("image/"));
        const merged = [...existing, ...incoming].slice(0, MAX_IMAGES);
        setValue("photographs", merged);
    };

    const onSubmit = async (data: TouristObjectSchema) => {
        console.log("Submit pokrenut", data);
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => {
                        if (v instanceof File) formData.append(key, v);
                        else formData.append(key, String(v));
                    });
                } else formData.append(key, String(value));
            });

            await createTouristObject(formData).unwrap();
            reset();
            alert("Objekat uspješno kreiran!");
            refetch?.();
            setEditMode?.(false);
        } catch (err) {
            console.error(err);
            alert("Greška prilikom kreiranja objekta.");
        }
    };

    const coordinate1 = useWatch({ control, name: "coordinate1", defaultValue: 44.0 }) ?? 44.0;
    const coordinate2 = useWatch({ control, name: "coordinate2", defaultValue: 17.0 }) ?? 17.0;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-6">Unos novog turističkog objekta</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Naziv */}
                <div>
                    <Label htmlFor="name">Naziv objekta</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                {/* Tip objekta */}
                <div>
                    <Label htmlFor="objectTypeId">Tip objekta</Label>
                    <Controller
                        control={control}
                        name="objectTypeId"
                        render={({ field }) => (
                            <select {...field} className="border rounded px-3 py-2 w-full" onChange={e => field.onChange(Number(e.target.value))}>
                                <option value={0}>Odaberi tip</option>
                                {types?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        )}
                    />
                    {errors.objectTypeId && <p className="text-red-500 text-sm">{errors.objectTypeId.message}</p>}
                </div>

                {/* Status */}
                <div>
                    <Label>Status</Label>
                    <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                            <RadioGroup
                                value={field.value.toString()} // boolean -> string
                                onValueChange={val => field.onChange(val === "true")} // string -> boolean
                                className="flex space-x-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" />
                                    <span>Aktivan</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" />
                                    <span>Neaktivan</span>
                                </div>
                            </RadioGroup>
                        )}
                    />
                </div>


                {/* Adresa */}
                <div>
                    <Label htmlFor="address">Adresa</Label>
                    <Input id="address" {...register("address")} />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                </div>

                {/* Map Picker */}
                <div>
                    <Label>Odaberi lokaciju na mapi</Label>
                    <MapPicker
                        lat={coordinate1}
                        lng={coordinate2}
                        onChange={(lat, lng) => {
                            setValue("coordinate1", round2(lat));
                            setValue("coordinate2", round2(lng));
                        }}
                    />
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <Label htmlFor="coordinate1">Latitude</Label>
                            <Input type="number" step="any" {...register("coordinate1", { valueAsNumber: true })} />
                            {errors.coordinate1 && <p className="text-red-500 text-sm">{errors.coordinate1.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="coordinate2">Longitude</Label>
                            <Input type="number" step="any" {...register("coordinate2", { valueAsNumber: true })} />
                            {errors.coordinate2 && <p className="text-red-500 text-sm">{errors.coordinate2.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Kontakt */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="contactPhone">Telefon</Label>
                        <Input {...register("contactPhone")} />
                        {errors.contactPhone && <p className="text-red-500 text-sm">{errors.contactPhone.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="contactEmail">Email</Label>
                        <Input type="email" {...register("contactEmail")} />
                        {errors.contactEmail && <p className="text-red-500 text-sm">{errors.contactEmail.message}</p>}
                    </div>
                </div>

                {/* Broj jedinica i kreveta */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="numberOfUnits">Broj jedinica</Label>
                        <Input type="number" {...register("numberOfUnits", { valueAsNumber: true })} />
                        {errors.numberOfUnits && <p className="text-red-500 text-sm">{errors.numberOfUnits.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="numberOfBeds">Broj kreveta</Label>
                        <Input type="number" {...register("numberOfBeds", { valueAsNumber: true })} />
                        {errors.numberOfBeds && <p className="text-red-500 text-sm">{errors.numberOfBeds.message}</p>}
                    </div>
                </div>

                {/* Opis */}
                <div>
                    <Label htmlFor="description">Opis</Label>
                    <Textarea rows={4} {...register("description")} />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                {/* Vlasnik */}
                <div>
                    <Label htmlFor="owner">Vlasnik</Label>
                    <Input {...register("owner")} />
                    {errors.owner && <p className="text-red-500 text-sm">{errors.owner.message}</p>}
                </div>

                {/* Featured */}
                {/* Featured */}
                <div>
                    <Label>Izdvojen</Label>
                    <Controller
                        control={control}
                        name="featured"
                        render={({ field }) => (
                            <RadioGroup
                                value={field.value.toString()} // boolean -> string
                                onValueChange={val => field.onChange(val === "true")} // string -> boolean
                                className="flex space-x-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" />
                                    <span>Da</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" />
                                    <span>Ne</span>
                                </div>
                            </RadioGroup>
                        )}
                    />
                </div>


                {/* Kategorija */}
                <div>
                    <Label htmlFor="categoryId">Kategorija</Label>
                    <Controller
                        control={control}
                        name="categoryId"
                        render={({ field }) => (
                            <select {...field} className="border rounded px-3 py-2 w-full" onChange={e => field.onChange(Number(e.target.value))}>
                                <option value={0}>Odaberi kategoriju</option>
                                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        )}
                    />
                </div>

                {/* Opština */}
                <div>
                    <Label htmlFor="municipalityId">Opština</Label>
                    <Controller
                        control={control}
                        name="municipalityId"
                        render={({ field }) => (
                            <select {...field} className="border rounded px-3 py-2 w-full" onChange={e => field.onChange(Number(e.target.value))}>
                                <option value={0}>Odaberi opštinu</option>
                                {municipalities?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        )}
                    />
                </div>

                {/* Dodatne usluge */}
                <div>
                    <Label>Dodatne usluge</Label>
                    <Controller
                        control={control}
                        name="additionalServiceIds"
                        render={({ field }) => (
                            <div className="flex flex-col space-y-2 mt-2">
                                {additionalServices?.map(service => (
                                    <label key={service.id} className="inline-flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            value={service.id}
                                            checked={field.value?.includes(service.id)}
                                            onChange={e => {
                                                if (e.target.checked) field.onChange([...(field.value || []), service.id]);
                                                else field.onChange(field.value?.filter(id => id !== service.id) || []);
                                            }}
                                        />
                                        <span>{service.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    />
                </div>

                {/* Upload slika */}
                <div>
                    <Label htmlFor="images">Dodaj slike (max {MAX_IMAGES})</Label>

                    <div
                        className="mt-2 border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted transition"
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => {
                            e.preventDefault();
                            if (e.dataTransfer.files) {
                                handleFiles(e.dataTransfer.files);
                            }
                        }}
                        onClick={() => fileInputRef.current?.click()} // <-- REF umjesto getElementById
                    >
                        <p className="text-sm text-muted-foreground">Klikni ili prevuci slike ovdje</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG · max {MAX_FILE_SIZE_MB}MB</p>
                    </div>

                    <input
                        ref={fileInputRef} // <-- REF ovdje
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={e => e.target.files && handleFiles(e.target.files)}
                    />

                    {previews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {previews.map((p, i) => (
                                <div key={i} className="relative group rounded-md overflow-hidden border">
                                    <img src={p.url} className="w-full h-32 object-cover" alt="preview" />
                                    <button
                                        type="button"
                                        onClick={() => setValue("photographs", photos.filter((_, idx) => idx !== i))}
                                        className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <Button variant="outline" onClick={() => reset()}>Otkaži</Button>
                    <Button type="submit" disabled={isSubmitting || isLoading}>Sačuvaj</Button>
                </div>
            </form>
        </div>
    );
}
