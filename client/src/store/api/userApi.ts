import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./baseApi";
import type { TokenResponseDto, UserInfoDto } from "../types/User";

interface LoginCredentials {
  username: string;
  password: string;
  firstName?: string; // samo za register
  lastName?: string;  // samo za register
  email?: string;
}


export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: customBaseQuery,
  tagTypes: ["User"],

  endpoints: (builder) => ({
    login: builder.mutation<TokenResponseDto, LoginCredentials>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    register: builder.mutation<TokenResponseDto, LoginCredentials>({
      query: (credentials) => ({
        url: "auth/register",
        method: "POST",
        body: credentials,
      }),
    }),

    refreshToken: builder.mutation<TokenResponseDto, void>({
      query: () => ({
        url: "auth/refresh-token",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    getCurrentUser: builder.query<UserInfoDto, void>({
      query: (body) => ({
        url: "auth/me",
        body
      }), 
      providesTags: ["User"],
    
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRegisterMutation
} = userApi;
