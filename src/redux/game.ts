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

export interface Player {
  gameId: string
  clientId: string
  name: string
  avatar_url: string
  player_id: string
  score: number
  status: string
}

export type BonusRequest = Pick<Player, 'gameId' | 'name'>

export interface GlobalGameState {
  quiz_started: boolean
  quiz_ended: boolean
  round: GameRound | null
  question: GameQuestion | null
  canRevealAnswer: boolean
  isRevealAnswer: boolean
  answeredQuestions: number[]
  totalPlayers: Player[]
  bonusLineUp: BonusRequest[]
  dealer_index: number
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
  dealer_index: 0,
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
    updateExitingPlayerState: (state, action: PayloadAction<string>) => {
      const updatedPlayerState = state.totalPlayers.map((player) => {
        if (player.clientId === action.payload)
          return { ...player, status: 'offline' }

        return player
      })

      state.totalPlayers = updatedPlayerState
    },
    addNewPlayerToState: (state, action: PayloadAction<Player>) => {
      const index = state.totalPlayers.findIndex(
        (player) => player.player_id === action.payload.player_id
      )

      if (index !== -1) {
        state.totalPlayers[index] = action.payload
      } else {
        state.totalPlayers.push(action.payload)
      }
    },
    addToBonusLineUp: (state, action: PayloadAction<BonusRequest>) => {
      const exists = state.bonusLineUp.some(
        (player) => player.gameId === action.payload.gameId
      )

      if (!exists) {
        state.bonusLineUp.push(action.payload)
      }
    },
  },
})

export const gameActions = gameSlice.actions
export const gameReducer = gameSlice.reducer
