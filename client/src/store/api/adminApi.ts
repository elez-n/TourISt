import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./baseApi";
import type { CreateOfficerResponse, Officer, SetPasswordDto } from "../types/Officer";
import type { UpdateUserDto, UserInfoDto } from "../types/User";
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

    getUserDetails: builder.query<UserInfoDto, string>({
      query: (id) => `admin/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),

    updateUser: builder.mutation<void, { id: string; data: UpdateUserDto }>({
      query: ({ id, data }) => ({
        url: `admin/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
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
  useGetUserDetailsQuery,
  useUpdateUserMutation
} = adminApi;
