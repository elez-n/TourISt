import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./baseApi";
import type { TouristObjectDto } from "../types/TouristObject";
import type { ObjectParams } from "../models/ObjectParams";
import type { Pagination } from "../types/Pagination";

export const touristObjectApi = createApi({
  reducerPath: "touristObjectApi",
  baseQuery: customBaseQuery,

  endpoints: (builder) => ({
    // GET: api/objects
    getTouristObjects: builder.query<{ objects: TouristObjectDto[]; pagination: Pagination }, ObjectParams>({
      query: (ObjectParams) => {
        return {
          url: 'objects',
          params: ObjectParams
        }
      },
      transformResponse: (objects: TouristObjectDto[], meta) => {
        const paginationHeader = meta?.response?.headers.get("Pagination");
        const pagination = paginationHeader
          ? JSON.parse(paginationHeader)
          : null;
        return { objects, pagination };
      },
    }),

    // GET: api/objects/{id}
    getTouristObjectById: builder.query<TouristObjectDto, number>({
      query: (id) => `objects/${id}`,
    }),

    fetchFilters: builder.query<{ types: string[], municipalities: string[], categories: string[] }, void>({
      query: () => 'objects/filters'
    })
  }),
});

export const {
  useGetTouristObjectsQuery,
  useGetTouristObjectByIdQuery,
  useFetchFiltersQuery
} = touristObjectApi;
