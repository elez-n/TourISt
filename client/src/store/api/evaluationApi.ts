import type { CriteriaDto } from "../types/Criteria";
import type { CreateEvaluationDto, EvaluationDto } from "../types/Evaluation";
import { customBaseQuery } from "./baseApi";
import { createApi } from "@reduxjs/toolkit/query/react";

export const evaluationApi = createApi({
  reducerPath: "evaluationApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Evaluations"],
  endpoints: (builder) => ({

    getEvaluationsForObject: builder.query<EvaluationDto[], number>({
      query: (objectId) => `evaluation/${objectId}`,
      providesTags: ["Evaluations"],
    }),

    getAllCriteria: builder.query<CriteriaDto[], void>({
      query: () => "evaluation/criteria",
    }),

    createEvaluation: builder.mutation<void, CreateEvaluationDto>({
      query: (data) => ({
        url: "evaluation",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Evaluations"],
    }),

  }),
});

export const {
  useGetEvaluationsForObjectQuery,
  useCreateEvaluationMutation,
  useGetAllCriteriaQuery
} = evaluationApi;
