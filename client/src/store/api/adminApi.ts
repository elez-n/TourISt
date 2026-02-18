import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./baseApi";
import type { CreateOfficerResponse, Officer, SetPasswordDto } from "../types/Officer";
import type { UserInfoDto } from "../types/User";
import type { Pagination } from "../types/Pagination";
import type { UserParams } from "../models/UserParams";


export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Officers", "Users"],
  endpoints: (builder) => ({
    createOfficer: builder.mutation<CreateOfficerResponse, Officer>({
      query: (officer) => ({
        url: "admin/create-officer",
        method: "POST",
        body: officer,
      }),
      invalidatesTags: [{ type: "Officers", id: "LIST" }],
    }),

    setPassword: builder.mutation<{ message: string }, { token: string; data: SetPasswordDto }>({
      query: ({ token, data }) => ({
        url: `admin/set-password?token=${token}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Officers", id: "LIST" }],
    }),

    getUsers: builder.query<{ users: UserInfoDto[]; pagination: Pagination }, UserParams>({
      query: (params) => ({
        url: "admin/users",
        params
      }),
      transformResponse: (users: UserInfoDto[], meta) => {
        const paginationHeader = meta?.response?.headers.get("Pagination");
        const pagination = paginationHeader ? JSON.parse(paginationHeader) : null;
        return { users, pagination };
      },
    }),

    toggleUserActiveStatus: builder.mutation<{ message: string; isActive: boolean }, string>({
      query: (userId) => ({
        url: `admin/toggle-active/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateOfficerMutation,
  useSetPasswordMutation,
  useGetUsersQuery,
  useToggleUserActiveStatusMutation,
} = adminApi;
