import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./baseApi";
import type { ReportDto, ReportResultDto } from "../types/Report";

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Reports"],
  endpoints: (builder) => ({
    getObjectsReport: builder.mutation<ReportResultDto[], ReportDto>({
      query: (dto) => ({
        url: "reports/objects",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["Reports"],
    }),

    generatePdfReport: builder.mutation<Blob, ReportDto>({
      query: (dto) => ({
        url: "reports/pdf",
        method: "POST",
        body: dto,
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),

    generateCsvReport: builder.mutation<Blob, ReportDto>({
      query: (dto) => ({
        url: "reports/csv",
        method: "POST",
        body: dto,
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),

    generateXlsxReport: builder.mutation<Blob, ReportDto>({
      query: (dto) => ({
        url: "reports/xlsx",
        method: "POST",
        body: dto,
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
  }),
});

export const {
  useGetObjectsReportMutation,
  useGeneratePdfReportMutation,
  useGenerateCsvReportMutation,
  useGenerateXlsxReportMutation,
} = reportsApi;