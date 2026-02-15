import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./baseApi";
import type { TouristObjectDto } from "../types/TouristObject";

export const favoritesApi = createApi({
  reducerPath: "favoritesApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Favorites"],
  endpoints: (builder) => ({

    getFavorites: builder.query<TouristObjectDto[], void>({
      query: () => "favorites",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Favorites" as const, id })),
              { type: "Favorites", id: "LIST" },
            ]
          : [{ type: "Favorites", id: "LIST" }],
    }),

    addFavorite: builder.mutation<{ message: string }, number>({
      query: (objectId) => ({
        url: "favorites",
        method: "POST",
        body: { objectId },
      }),
      invalidatesTags: [{ type: "Favorites", id: "LIST" }],
    }),

    removeFavorite: builder.mutation<{ message: string }, number>({
      query: (objectId) => ({
        url: `favorites/${objectId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Favorites", id: "LIST" }],
    }),

    getFavoriteIds: builder.query<number[], void>({
      query: () => "favorites/ids",
      providesTags: (result) =>
        result
          ? [
              ...result.map((id) => ({ type: "Favorites" as const, id })),
              { type: "Favorites", id: "LIST" },
            ]
          : [{ type: "Favorites", id: "LIST" }],
    }),
  }),
});

export const {
  useGetFavoritesQuery,      
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetFavoriteIdsQuery,
} = favoritesApi;
