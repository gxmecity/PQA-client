import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { GameRound } from './game'

export interface Player {
  gameId: string
  name: string
  avatar_url?: string
  player_id?: string
}

export interface GlobalPlayerState {
  quiz_started: boolean
  quiz_ended: boolean
  round: GameRound | null
  question: Question | null
  player: Player | null
  buzzer: boolean
}

const initialState: GlobalPlayerState = {
  quiz_started: false,
  quiz_ended: false,
  round: null,
  question: null,
  player: null,
  buzzer: false,
}

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    resetGame: () => initialState,
    updateGameState: (
      state,
      action: PayloadAction<Partial<GlobalPlayerState>>
    ) => {
      Object.assign(state, action.payload)
    },
    updateGameRound: (state, action: PayloadAction<Partial<GameRound>>) => {
      if (!state.round) return
      state.round = { ...state.round, ...action.payload }
    },
  },
})

export const playerGameActions = playerSlice.actions
export const playerGameReducer = playerSlice.reducer
