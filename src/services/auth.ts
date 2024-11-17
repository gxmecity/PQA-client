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
    }),
  }),
})

export const {
  useLoginUserMutation,
  useSignUpNewUserMutation,
  useRetrieveUserSessionQuery,
} = authApiSlice
