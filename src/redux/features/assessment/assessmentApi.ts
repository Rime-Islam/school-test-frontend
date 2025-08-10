import { tagTypes } from "../../tag-type";
import { baseApi } from "../baseApi";

const assessmentSessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAssessmentSession: builder.mutation({
      query: (sessionData) => ({
        url: "/assessment",
        method: "PATCH",
        body: sessionData,
      }),
      invalidatesTags: [tagTypes.assessment],
    }),

    getAllAssessmentSessions: builder.query({
      query: (params) => ({
        url: "/assessment",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.assessment],
    }),

    getAssessmentSessionsByUser: builder.mutation({
      query: () => ({
        url: "/assessment/user",
        method: "POST",
      }),
      invalidatesTags: [tagTypes.assessment],
    }),

    getResult: builder.mutation({
      query: (id) => ({
        url: `/assessment/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.assessment],
    }),

    getUserAssessmentSessions: builder.query({
      query: () => "/assessment/user",
      providesTags: ["AssessmentSession"],
    }),
  }),
});

export const {
  useCreateAssessmentSessionMutation,
  useGetAllAssessmentSessionsQuery,
  useGetAssessmentSessionsByUserMutation,
  useGetUserAssessmentSessionsQuery,
  useGetResultMutation
} = assessmentSessionApi;
