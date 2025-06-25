import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { apiSlice } from '@/services/apiSlice'
import { authReducer } from './auth'
import { setupListeners } from '@reduxjs/toolkit/query'
import { gameReducer } from './game'
import { playerGameReducer } from './player'

const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    player: playerGameReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDisPatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default store
