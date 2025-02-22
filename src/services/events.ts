import { apiSlice } from './apiSlice'

export const eventsAndSeriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserHostedEvents: builder.query<QuizEvent[], string>({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'GET',
      }),
      providesTags: ['Events'],
      transformResponse: (res: SuccessHttpResponse<QuizEvent[]>) => res.data,
    }),
    createHostedEvent: builder.mutation<QuizEvent, Partial<QuizEvent>>({
      query: (data) => ({
        url: '/events',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Events'],
      transformResponse: (res: SuccessHttpResponse<QuizEvent>) => res.data,
    }),
    getEventById: builder.query<QuizEvent, string>({
      query: (id) => ({
        url: `/events/event/${id}`,
        method: 'GET',
      }),
      providesTags: ['Event-Details'],
      transformResponse: (res: SuccessHttpResponse<QuizEvent>) => res.data,
    }),
    updateQuizEvent: builder.mutation<
      QuizEvent,
      { id: string; data: Partial<QuizEvent> }
    >({
      query: ({ id, data }) => ({
        url: `/events/event/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Event-Details'],
      transformResponse: (res: SuccessHttpResponse<QuizEvent>) => res.data,
    }),
    getEventByHostCode: builder.query<QuizEvent, string>({
      query: (id) => ({
        url: `/play/host/${id}`,
        method: 'GET',
      }),
      transformResponse: (res: SuccessHttpResponse<QuizEvent>) => res.data,
    }),
    getEventByEntryCode: builder.query<QuizEvent, string>({
      query: (id) => ({
        url: `/play/guest/${id}`,
        method: 'GET',
      }),
      transformResponse: (res: SuccessHttpResponse<QuizEvent>) => res.data,
    }),
    signInTeamToEvent: builder.mutation<
      Team,
      { id: string; passphrase: string }
    >({
      query: (data) => ({
        url: '/event/team-join',
        method: 'POST',
        data,
      }),
      transformResponse: (res: SuccessHttpResponse<Team>) => res.data,
    }),
  }),
})

export const {
  useGetUserHostedEventsQuery,
  useCreateHostedEventMutation,
  useGetEventByIdQuery,
  useUpdateQuizEventMutation,
  useGetEventByEntryCodeQuery,
  useLazyGetEventByEntryCodeQuery,
  useGetEventByHostCodeQuery,
  useLazyGetEventByHostCodeQuery,
  useSignInTeamToEventMutation,
} = eventsAndSeriesApiSlice
