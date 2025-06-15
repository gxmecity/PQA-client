import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface GameRound {
  title: string
  type: string
  time: number
  index: number
  round_started: boolean
  round_ended: boolean
  isLastRound: boolean
  totalQuestions: number
}

export interface GameQuestion {
  question: QuizQuestion
  index: number
  isLast: boolean
}

export interface GlobalGameState {
  quiz_started: boolean
  quiz_ended: boolean
  round: GameRound | null
  question: GameQuestion | null
  canRevealAnswer: boolean
  isRevealAnswer: boolean
  answeredQuestions: number[]
  totalPlayers: any[]
  bonusLineUp: any[]
  dealer_index: number | null
  connectedRemoteDevices: number
}

const initialState: GlobalGameState = {
  quiz_started: false,
  quiz_ended: false,
  round: null,
  question: null,
  canRevealAnswer: false,
  isRevealAnswer: false,
  answeredQuestions: [],
  totalPlayers: [],
  bonusLineUp: [],
  dealer_index: null,
  connectedRemoteDevices: 0,
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    resetGame: () => initialState,
    updateGameState: (
      state,
      action: PayloadAction<Partial<GlobalGameState>>
    ) => {
      Object.assign(state, action.payload)
    },
    updateGameRound: (state, action: PayloadAction<Partial<GameRound>>) => {
      if (!state.round) return
      state.round = { ...state.round, ...action.payload }
    },
  },
})

export const gameActions = gameSlice.actions
export const gameReducer = gameSlice.reducer
