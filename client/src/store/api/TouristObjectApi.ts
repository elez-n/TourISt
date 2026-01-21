import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./baseApi";
import type { TouristObjectDto } from "../types/TouristObject";
import type { ObjectParams } from "../models/ObjectParams";

export const touristObjectApi = createApi({
  reducerPath: "touristObjectApi",
  baseQuery: customBaseQuery,

  endpoints: (builder) => ({
    // GET: api/objects
    getTouristObjects: builder.query<TouristObjectDto[], ObjectParams>({
      query: (ObjectParams) => {
        return {
          url: 'objects',
          params: ObjectParams
        }
      }
    }),

    // GET: api/objects/{id}
    getTouristObjectById: builder.query<TouristObjectDto, number>({
      query: (id) => `objects/${id}`,
    }),

    fetchFilters: builder.query<{types: string[], municipalities: string[], categories: string[]}, void>({
      query: () => 'objects/filters'
    })
  }),
});

export const {
  useGetTouristObjectsQuery,
  useGetTouristObjectByIdQuery,
  useFetchFiltersQuery
} = touristObjectApi;
