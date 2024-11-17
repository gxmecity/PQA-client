import { apiSlice } from './apiSlice'

export const quizApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserCreatedQuiz: builder.query<Quiz[], undefined>({
      query: () => ({
        url: '/my-quiz',
        method: 'GET',
      }),
      providesTags: ['Quiz'],
      transformResponse: (res: SuccessHttpResponse<Quiz[]>) => res.data,
    }),
    createNewQuiz: builder.mutation<Quiz, Pick<Quiz, 'title' | 'description'>>({
      query: (data) => ({
        url: '/my-quiz',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Quiz', 'Quiz-Details'],
      transformResponse: (res: SuccessHttpResponse<Quiz>) => res.data,
    }),
    getUserQuizDetails: builder.query<Quiz, string>({
      query: (id) => ({
        url: `/my-quiz/${id}`,
        method: 'GET',
      }),
      transformResponse: (res: SuccessHttpResponse<Quiz>) => res.data,
      providesTags: ['Quiz-Details'],
    }),
    updateUserQuizDetails: builder.mutation<
      Quiz,
      { id: string; data: Partial<Quiz> }
    >({
      query: ({ id, data }) => ({
        url: `/my-quiz/${id}`,
        method: 'PATCH',
        data,
      }),
      transformResponse: (res: SuccessHttpResponse<Quiz>) => res.data,
      invalidatesTags: ['Quiz-Details', 'Quiz'],
    }),
    deleteUserQuiz: builder.mutation<null, string>({
      query: (id) => ({
        url: `/my-quiz/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Quiz-Details', 'Quiz'],
    }),
  }),
})

export const {
  useGetUserCreatedQuizQuery,
  useCreateNewQuizMutation,
  useGetUserQuizDetailsQuery,
  useUpdateUserQuizDetailsMutation,
  useDeleteUserQuizMutation,
} = quizApiSlice
