import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./baseApi";
import type { TouristObjectDto } from "../types/TouristObject";
import type { ObjectParams } from "../models/ObjectParams";
import type { Pagination } from "../types/Pagination";

export const touristObjectApi = createApi({
  reducerPath: "touristObjectApi",
  baseQuery: customBaseQuery,
  tagTypes: ["TouristObjects"],

  endpoints: (builder) => ({
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
      providesTags: ["TouristObjects"]
    }),

    // GET: api/objects/{id}
    getTouristObjectById: builder.query<TouristObjectDto, number>({
      query: (id) => `objects/${id}`,
    }),

    fetchFilters: builder.query<{ types: string[], municipalities: string[], categories: string[] }, void>({
      query: () => 'objects/filters'
    }),
    fetchObjectTypes: builder.query<{ id: number; name: string }[], void>({
      query: () => "objects/object-types",
    }),

    // Fetch Categories
    fetchCategories: builder.query<{ id: number; name: string }[], void>({
      query: () => "objects/categories",
    }),

    // Fetch Municipalities
    fetchMunicipalities: builder.query<{ id: number; name: string }[], void>({
      query: () => "objects/municipalities",
    }),

    // Fetch Additional Services
    fetchAdditionalServices: builder.query<{ id: number; name: string }[], void>({
      query: () => "objects/additional-services",
    }),
    createTouristObject: builder.mutation<TouristObjectDto, FormData>({
      query: (formData) => ({
        url: "objects",
        method: "POST",
        body: formData,
      }),
    }),

    updateTouristObject: builder.mutation<
      TouristObjectDto,
      { id: number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `objects/edit/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),

    deleteTouristObject: builder.mutation<void, number> ({
      query: (id) => ({
        url: `objects/delete/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["TouristObjects"]
    }),

    FetchFeaturedObjects: builder.query<TouristObjectDto[], void> ({
      query: () => 'objects/featured-objects'
    })
  }),

});

export const {
  useGetTouristObjectsQuery,
  useGetTouristObjectByIdQuery,
  useFetchFiltersQuery,
  useCreateTouristObjectMutation,
  useUpdateTouristObjectMutation,
  useFetchObjectTypesQuery,
  useFetchCategoriesQuery,
  useFetchMunicipalitiesQuery,
  useFetchAdditionalServicesQuery,
  useDeleteTouristObjectMutation,
  useFetchFeaturedObjectsQuery
} = touristObjectApi;
