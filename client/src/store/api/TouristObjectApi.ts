import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./baseApi";
import type { TouristObjectDto } from "../types/TouristObject";

export const touristObjectApi = createApi({
  reducerPath: "touristObjectApi",
  baseQuery: customBaseQuery,

  endpoints: (builder) => ({
    // GET: api/objects
    getTouristObjects: builder.query<TouristObjectDto[], void>({
      query: () => "objects",
    }),

    // GET: api/objects/{id}
    getTouristObjectById: builder.query<TouristObjectDto, number>({
      query: (id) => `objects/${id}`,
    }),
  }),
});

export const {
  useGetTouristObjectsQuery,
  useGetTouristObjectByIdQuery,
} = touristObjectApi;
