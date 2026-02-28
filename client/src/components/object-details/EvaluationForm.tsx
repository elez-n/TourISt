import React, { useEffect } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSelector } from "react-redux";
import { useCreateEvaluationMutation, useGetAllCriteriaQuery } from "@/store/api/evaluationApi";
import type { RootState } from "@/store/store";

type EvaluationFormValues = {
    scores: { criteriaId: number; points: number }[];
};

const createEvaluationSchema = (criteria: { id: number; name: string; maxPoints: number; description: string}[]) =>
    z.object({
        scores: z
            .array(
                z.object({
                    criteriaId: z.number(),
                    points: z.number().min(0, "Minimalno 0 bodova"),
                })
            )
            .superRefine((scores, ctx) => {
                scores.forEach((score, i) => {
                    const crit = criteria.find((c) => c.id === score.criteriaId);
                    if (crit && score.points > crit.maxPoints) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.too_big,
                            maximum: crit.maxPoints,
                            type: "number",
                            inclusive: true,
                            message: `Previše bodova za kriterij ${crit.name}`,
                            path: ["scores", i, "points"],
                            origin: "number",
                        });
                    }
                });
            }),
    });

interface Props {
    touristObjectId: number;
    onSuccess?: () => void;
}

export const EvaluationForm: React.FC<Props> = ({ touristObjectId, onSuccess }) => {
    const { data: criteria } = useGetAllCriteriaQuery();
    const [createEvaluation, { isLoading: isSubmitting }] = useCreateEvaluationMutation();
    const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

    const defaultValues = criteria
        ? { scores: criteria.map((c) => ({ criteriaId: c.id, points: 0 })) }
        : { scores: [] };

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<EvaluationFormValues>({
        resolver: criteria ? zodResolver(createEvaluationSchema(criteria)) : undefined,
        defaultValues,
        mode: "onChange",
    });

    useEffect(() => {
        if (criteria) {
            reset({
                scores: criteria.map((c) => ({ criteriaId: c.id, points: 0 })),
            });
        }
    }, [criteria, reset]);

    const onSubmit: SubmitHandler<EvaluationFormValues> = async (values) => {
        if (!currentUserId) return alert("Korisnik nije prijavljen");
    
        try {
            await createEvaluation({
                touristObjectId,
                userId: currentUserId,
                scores: values.scores,
            }).unwrap();
            onSuccess?.();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "data" in err) {
                alert(err || "Greška prilikom kategorizacije.");
            } else {
                alert("Greška prilikom kategorizacije.");
            }
        }
    };

    if (!criteria || criteria.length === 0) return <p>Nema definisanih kriterija.</p>;

    return (
    <div className="w-full h-full overflow-y-auto px-4 py-6">
        <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl border border-gray-200">

            <div className="px-6 py-5 border-b border-gray-100">
                <p className="text-sm text-gray-500 mt-1">
                    Unesite bodove za svaki kriterijum.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

                <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">Kriterijum</th>
                                <th className="px-4 py-3 text-left">Opis</th>
                                <th className="px-4 py-3 text-left">Maks. bodova</th>
                                <th className="px-4 py-3 text-left">Vaš unos</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {criteria.map((c, index) => (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 font-medium text-gray-800">
                                        {c.name}
                                    </td>
                                    <td className="px-4 py-4 font-medium text-gray-800">
                                        {c.description}
                                    </td>

                                    <td className="px-4 py-4 text-gray-600">
                                        {c.maxPoints}
                                    </td>

                                    <td className="px-4 py-4">
                                        <Controller
                                            name={`scores.${index}.points`}
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <input
                                                        type="number"
                                                        value={field.value ?? 0}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        min={0}
                                                        max={c.maxPoints}
                                                        className="w-24 px-3 py-2 border border-gray-300 rounded-md
                                                                   focus:ring-2 focus:ring-blue-500
                                                                   focus:outline-none transition"
                                                    />
                                                    {errors.scores?.[index]?.points && (
                                                        <p className="text-xs text-red-500 mt-1">
                                                            {errors.scores[index]?.points?.message}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => onSuccess?.()}
                        className="px-4 py-2 rounded-md border border-gray-300
                                   text-gray-600 hover:bg-gray-100 transition"
                    >
                        Otkaži
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 rounded-md bg-[#5c5c99]! text-white
                                   hover:bg-[#272757]!
                                   transition"
                    >
                        {isSubmitting ? "Šaljem..." : "Sačuvaj evaluaciju"}
                    </button>
                </div>

            </form>
        </div>
    </div>
);

};
