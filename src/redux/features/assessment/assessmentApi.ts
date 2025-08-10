import { tagTypes } from "../../tag-type";
import { baseApi } from "../baseApi";

const assessmentSessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAssessmentSession: builder.mutation({
      query: (sessionData) => ({
        url: "/assessment",
        method: "POST",
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

    getAssessmentSessionById: builder.query({
      query: (id: string) => ({
        url: `/assessment/${id}`,
        method: "GET",
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

    updateAssessmentSession: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/assessment/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: [tagTypes.assessment],
    }),

    deleteAssessmentSession: builder.mutation({
      query: (id) => ({
        url: `/assessment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.assessment],
    }),

    addAnswerToSession: builder.mutation({
      query: ({ sessionId, answer }) => ({
        url: `/assessment/${sessionId}/answers`,
        method: "POST",
        body: answer,
      }),
      invalidatesTags: [tagTypes.assessment],
    }),

    completeAssessmentSession: builder.mutation({
      query: ({ sessionId, results }) => ({
        url: `/assessment/${sessionId}/complete`,
        method: "POST",
        body: { results },
      }),
      invalidatesTags: [tagTypes.assessment],
    }),

     getUserAssessmentSessions: builder.query({
      query: () => '/assessment/user',
      providesTags: ['AssessmentSession'],
    }),

  }),
});

export const {
  useCreateAssessmentSessionMutation,
  useGetAllAssessmentSessionsQuery,
  useGetAssessmentSessionByIdQuery,
  useGetAssessmentSessionsByUserMutation,
  useUpdateAssessmentSessionMutation,
  useDeleteAssessmentSessionMutation,
  useAddAnswerToSessionMutation,
  useCompleteAssessmentSessionMutation,
  useGetUserAssessmentSessionsQuery,
} = assessmentSessionApi;
