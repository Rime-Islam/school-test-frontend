import { tagTypes } from "../../tag-type";
import { baseApi } from "../baseApi";

const questionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createQuestion: builder.mutation({
      query: (questionData) => ({
        url: "/question",
        method: "POST",
        body: questionData,
      }),
    }),

    getAllQuestions: builder.query({
      query: (params) => ({
        url: "/question",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.question],
    }),

    getQuestionById: builder.query({
      query: (id: string) => ({
        url: `/question/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.question],
    }),

    updateQuestion: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/question/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: [tagTypes.question],
    }),

    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/question/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.question],
    }),
  }),
});

export const {
  useCreateQuestionMutation,
  useGetAllQuestionsQuery,
  useGetQuestionByIdQuery,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionApi;
