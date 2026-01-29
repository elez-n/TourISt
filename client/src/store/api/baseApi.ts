import {
  fetchBaseQuery,
  type FetchArgs,
  type BaseQueryApi,
} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://localhost:5001/api/",
  credentials: "include", 
});

export const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    console.error("API error:", result.error);
  }

  return result;
};
