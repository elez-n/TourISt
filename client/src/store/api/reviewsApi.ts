import { customBaseQuery } from "./baseApi";
import type { ReviewDto } from "../types/ReviewDto";
import { createApi } from "@reduxjs/toolkit/query/react";

export const reviewsApi = createApi({
    reducerPath: "reviewsApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Reviews"],
    endpoints: (builder) => ({
        getReviewsForObject: builder.query<ReviewDto[], number>({
            query: (objectId) => `reviews/objects/${objectId}`,
            providesTags: ["Reviews"]
        }),

        createReview: builder.mutation<void, { objectId: number; rating: number; description: string }>({
            query: ({ objectId, rating, description }) => ({
                url: "reviews",
                method: "POST",
                body: {
                    touristObjectId: objectId,
                    rating,
                    description,
                },
                invalidatesTags: ["Reviews"],
            }),
        }),

    }),
});

export const { useGetReviewsForObjectQuery, useCreateReviewMutation } = reviewsApi;

