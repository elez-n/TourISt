import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./baseApi";
import type { CreateOfficerResponse, Officer, SetPasswordDto } from "../types/Officer";


export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Officers"],
  endpoints: (builder) => ({
    // Kreiranje službenika
    createOfficer: builder.mutation<CreateOfficerResponse, Officer>({
      query: (officer) => ({
        url: "admin/create-officer",
        method: "POST",
        body: officer,
      }),
      invalidatesTags: [{ type: "Officers", id: "LIST" }],
    }),

    // Postavljanje lozinke preko tokena
    setPassword: builder.mutation<{ message: string }, { token: string; data: SetPasswordDto }>({
      query: ({ token, data }) => ({
        url: `admin/set-password?token=${token}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Officers", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateOfficerMutation,
  useSetPasswordMutation,
} = adminApi;
