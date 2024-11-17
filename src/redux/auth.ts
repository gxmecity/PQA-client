// eslint-disable-next-line import/named
import { authApiSlice } from '@/services/auth'
import { createSlice } from '@reduxjs/toolkit'

const initialState: {
  user: User | undefined
} = {
  user: undefined,
}

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApiSlice.endpoints.loginUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user
        localStorage.setItem('pqa_user_token', payload.token)
      }
    )
    builder.addMatcher(
      authApiSlice.endpoints.signUpNewUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user
        localStorage.setItem('pqa_user_token', payload.token)
      }
    )
    builder.addMatcher(
      authApiSlice.endpoints.retrieveUserSession.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user
      }
    )
  },
})

export const authActions = auth.actions
export const authReducer = auth.reducer
