import { apiSlice } from './apiSlice'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<Auth, LoginData>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        data,
      }),
      transformResponse: (res: SuccessHttpResponse<Auth>) => res.data,
    }),
    signUpNewUser: builder.mutation<Auth, Partial<SignupData>>({
      query: (data) => ({
        url: '/auth/signup',
        method: 'POST',
        data,
      }),
      transformResponse: (res: SuccessHttpResponse<Auth>) => res.data,
    }),
    retrieveUserSession: builder.query<Auth, undefined>({
      query: () => ({
        url: '/auth/retrieve-session',
        method: 'GET',
      }),
      transformResponse: (res: SuccessHttpResponse<Auth>) => res.data,
      transformErrorResponse: (err: any) => {
        localStorage.removeItem('pqa_user_token')
        return err
      },
    }),
    getDashboardStats: builder.query({
      query: () => ({
        url: '/auth/dashboard-stats',
        method: 'GET',
      }),
    }),
    getUserDetails: builder.query<Auth, string>({
      query: (id) => ({
        url: `/auth/user/${id}`,
        method: 'GET',
      }),
      transformResponse: (res: SuccessHttpResponse<Auth>) => res.data,
    }),
    getUserRegisteredTeams: builder.query<Team[], string>({
      query: (id) => ({
        url: `/teams/${id}`,
        method: 'GET',
      }),
      transformResponse: (res: SuccessHttpResponse<Team[]>) => res.data,
      providesTags: ['Teams'],
    }),
    getTeamDetails: builder.query<Team, string>({
      query: (id) => ({
        url: `/team/${id}`,
        method: 'GET',
      }),
      transformResponse: (res: SuccessHttpResponse<Team>) => res.data,
      providesTags: ['Team-Details'],
    }),
    registerNewTeam: builder.mutation<Team, any>({
      query: (data) => ({
        url: `/team/register`,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data;',
        },
        data,
        formData: true,
      }),
      transformResponse: (res: SuccessHttpResponse<Team>) => res.data,
      invalidatesTags: ['Teams'],
    }),
    updateTeamDetails: builder.mutation<Team, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/team/update/${id}`,
        method: 'PATCH',
        data,
        headers: {
          'Content-Type': 'multipart/form-data;',
        },
        formData: true,
      }),
      transformResponse: (res: SuccessHttpResponse<Team>) => res.data,
      invalidatesTags: ['Team-Details', 'Teams'],
    }),
  }),
})

export const {
  useLoginUserMutation,
  useSignUpNewUserMutation,
  useRetrieveUserSessionQuery,
  useGetUserRegisteredTeamsQuery,
  useGetTeamDetailsQuery,
  useRegisterNewTeamMutation,
  useUpdateTeamDetailsMutation,
  useGetDashboardStatsQuery,
  useGetUserDetailsQuery,
} = authApiSlice
