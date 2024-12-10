import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { toast } from 'sonner'
import { RoundLeaderboard } from '@/app/Dashboard/App/Events/Game/Game'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const errorResponseHandler = (err: ErrorResponse) => {
  if (!err?.data.message) {
    toast.error('Uh oh! Something went wrong.', {
      description: 'There was a problem with your request.',
    })
    return
  }

  const errorMessage = err.data.message

  if (typeof errorMessage === 'string') {
    return toast.error('Uh oh! Something went wrong.', {
      description: errorMessage,
    })
  }

  const message: { [key in string]: string[] } = errorMessage

  for (const key in message) {
    const errormessage = `${key} : ${message[key].join(' ')}`
    toast.error('Uh oh! Something went wrong.', {
      description: errormessage,
    })
  }
}

export const getTimeDifferenceFromDate = (data: string) => {
  const date = new Date().getTime()
  const datePlayed = new Date(data).getTime()
  const diff = date - datePlayed

  const toSec = diff / 1000
  const toMin = toSec / 60
  const toHour = toMin / 60
  const toDays = toHour / 24

  const returnText =
    toDays >= 1
      ? new Intl.RelativeTimeFormat('en').format(-Math.round(toDays), 'day')
      : toHour >= 1
        ? new Intl.RelativeTimeFormat('en').format(-Math.round(toHour), 'hour')
        : 'Less than an hour ago'

  return returnText
}

export const generateQuizEntryCode = () => {
  const part1 = Math.floor(1000 + Math.random() * 9000)
  const part2 = Math.floor(1000 + Math.random() * 9000)
  return `${part1}${part2}`
}

export const splitCodeInHalf = (code: string) => {
  const first = code.slice(0, 4)
  const second = code.slice(4, 8)

  return `${first} ${second}`
}

export const copyTextToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  toast.success('Copied to clipboard')
}

export const pointAllocationByTimeAnswered = (
  timeAnswered: number,
  totalTime: number
) => {
  const percentageTimeOfAnswer = (timeAnswered / totalTime) * 100

  switch (true) {
    case percentageTimeOfAnswer >= 75:
      return 10
    case percentageTimeOfAnswer >= 50:
      return (75 / 100) * 10
    case percentageTimeOfAnswer >= 30:
      return (50 / 100) * 10
    default:
      return (10 / 100) * 10
  }
}

export const removeSpaceFromAnswerString = (value: string) => {
  return value.replace(/\s+/g, '').toLowerCase()
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
}

export const initializeRoundLeaderboard = (rounds: any[]): RoundLeaderboard => {
  const initialLeaderboard: RoundLeaderboard = {}

  rounds.forEach((_, index) => {
    initialLeaderboard[`round-${index}`] = {}
  })

  return initialLeaderboard
}

export const computeFinalLeaderboard = (scores: RoundLeaderboard) => {
  const finalScores: { [key: string]: LeaderboardEntry } = {}

  // Aggregate scores across rounds
  for (const round in scores) {
    for (const playerId in scores[round]) {
      const player = scores[round][playerId]
      if (!finalScores[playerId]) {
        finalScores[playerId] = {
          player: { name: player.name, id: playerId, team_id: player.team_id },
          score: 0,
        }
      }
      finalScores[playerId].score += player.score
    }
  }

  // Convert aggregated scores into leaderboard array
  const leaderboard: LeaderboardEntry[] = Object.values(finalScores)

  // Sort by score in descending order
  leaderboard.sort((a, b) => b.score - a.score)

  return leaderboard
}

export const nthNumber = (number: number) => {
  if (number > 3 && number < 21) return 'th'
  switch (number % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}
