import type { TokenResponseDto } from "./../types/User";
import { customBaseQuery } from "./baseApi";
import type { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query/react";

interface LoginCredentials {
    username: string;
    password: string;
}

interface CurrentUserDto {
    id: string;
    username: string;
    role: string;
    accessToken: string;
}

export const userApi = {
    login: async (credentials: LoginCredentials): Promise<{ data: TokenResponseDto }> => {
        const result = await customBaseQuery(
            { url: "auth/login", method: "POST", body: credentials } as FetchArgs,
            {} as BaseQueryApi,
            {}
        );

        if (result.error) {
            console.error("Login failed:", result.error);
            throw new Error("Login failed");
        }

        return { data: result.data as TokenResponseDto };
    },

    refresh: async (): Promise<{ data: TokenResponseDto }> => {
        const result = await customBaseQuery(
            { url: "auth/refresh-token", method: "POST" } as FetchArgs,
            {} as BaseQueryApi,
            {}
        );

        if ("error" in result) {
            throw new Error("Refresh failed");
        }

        return { data: result.data as TokenResponseDto };
    },

    logout: async (): Promise<void> => {
        const result = await customBaseQuery(
            { url: "auth/logout", method: "POST" } as FetchArgs,
            {} as BaseQueryApi,
            {}
        );

        if ("error" in result) throw new Error("Logout failed");
    },

    getCurrentUser: async (): Promise<{ data: CurrentUserDto }> => {
        const result = await customBaseQuery(
            { url: "auth/refresh-token", method: "POST" } as FetchArgs,
            {} as BaseQueryApi,
            {}
        );

        if (result.error) {
            console.error("Get current user failed:", result.error);
            throw new Error("Get current user failed");
        }

        return { data: result.data as CurrentUserDto };
    },
};
