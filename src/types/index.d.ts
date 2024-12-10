declare interface SuccessHttpResponse<T> {
  success: boolean
  message: string
  data: T
}
declare interface ErrorResponse {
  status: number
  data: ErrorHttpResponse
}

declare interface ErrorHttpResponse {
  status: number
  message: string
  success: boolean
}

//Auth Types
declare interface LoginData {
  email: string
  password: string
}

declare interface SignupData extends LoginData {
  confirm_password: string
  terms: boolean
  fullname: string
}

declare interface RegisterTeamData {
  name: string
  sigil: string
  passphrase: string
  team_members: { name: string }[]
}

// Generated by https://quicktype.io

declare interface Auth {
  user: User
  token: string
}

declare interface User {
  _id: string
  fullname: string
  email: string
  profile_img?: string
  role: string
  createdAt: string
  updatedAt: string
  __v: number
}
declare interface DashboardStats {
  quiz: number
  events: number
  series: number
  userTeams: number
}

declare interface Team {
  _id: string
  name: string
  sigil: string
  team_members: string[]
  quiz_master: User
}

// QUiz Types
declare interface Quiz {
  _type: string
  _id: string
  _updatedAt: string
  description?: string
  creator: User
  _createdAt: string
  publish: boolean
  _rev: string
  plays: number
  title: string
  rounds: Round[]
}

declare interface Answer {
  answer_text: string
  is_blackbox?: boolean
}

declare interface Question {
  question_text: string
  question_type: string
  question_media?: {
    type: string
    url: string
  }
  multi_choice_options?: string[]
  standalone_media: boolean
}

declare interface QuizQuestion {
  question: Question
  answer: Answer
  _id: string
}

declare interface Round {
  round_name: string
  round_type: string
  questions: QuizQuestion[]
  timer: number
  _id: string
}

declare interface QuizEvent {
  title: string
  host_entry_code?: string
  entry_code?: string
  quiz: string
  scheduled_date?: Date
  leaderboard: LeaderboardEntry[]
  creator: User
  _id: string
  createdAt: string
  updatedAt: string
  event_started: boolean
  event_ended: boolean
}

declare interface Player {
  name: string
  team_id?: string
  clientId: string
  avatar_url?: string
}

declare interface LeaderboardEntry {
  player: {
    name: string
    id: string
    team_id?: string
  }
  score: number
}
