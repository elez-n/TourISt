import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./baseApi";
import type { StatisticsDto } from "../types/Statistics";

export const statisticsApi = createApi({
  reducerPath: "statisticsApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Statistics"],
  endpoints: (builder) => ({
    getStatistics: builder.query<StatisticsDto, void>({
      query: () => ({
        url: "statistics/overview",
        method: "GET",
      }),
      providesTags: ["Statistics"],
    }),
  }),
});

export const { useGetStatisticsQuery } = statisticsApi;