import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./baseApi";
import type { 
  RegistrationRequestDto, 
  GetRegistrationRequestDto, 
  UpdateStatusDto 
} from "../../models/types/RegistrationRequest";

export const registrationRequestsApi = createApi({
  reducerPath: "registrationRequestsApi",
  baseQuery: customBaseQuery,
  tagTypes: ["RegistrationRequests"],
  endpoints: (builder) => ({
    getRequests: builder.query<GetRegistrationRequestDto[], void>({
      query: () => "registrationrequests",
      providesTags: ["RegistrationRequests"],
    }),

    createRequest: builder.mutation<void, RegistrationRequestDto>({
      query: (dto) => ({
        url: "registrationrequests",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["RegistrationRequests"],
    }),

    updateStatus: builder.mutation<void, { id: number; dto: UpdateStatusDto }>({
      query: ({ id, dto }) => ({
        url: `registrationrequests/${id}/status`,
        method: "PUT",
        body: dto,
      }),
      invalidatesTags: ["RegistrationRequests"],
    }),
  }),
});

export const {
  useGetRequestsQuery,
  useCreateRequestMutation,
  useUpdateStatusMutation,
} = registrationRequestsApi;