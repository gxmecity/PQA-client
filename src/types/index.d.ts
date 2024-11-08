declare interface LoginData {
  email: string
  password: string
}

// QUiz Types
declare interface Quiz {
  _type: string
  _id: string
  _updatedAt: string
  creator: Reference
  _createdAt: string
  publish: boolean
  _rev: string
  plays: number
  title: string
  rounds: Round[]
}

declare interface Round {
  round_name: string
  round_type: string
  _type: string
  questions: QuestionElement[]
  _key: string
  category: string
  timer: number
}

declare interface Reference {
  _ref: string
  _type: string
}

declare interface QuestionElement {
  _type: string
  _key: string
  answer: Answer
  question: QuestionQuestion
}

declare interface Answer {
  answer_text: string
}

declare interface QuestionQuestion {
  question_text: string
  number: number
  question_type: string
  question_image?: Asset
  multi_choice_options?: string[]
  question_video?: Asset
  standalone_asset: boolean
  asset_type: string
}

declare interface Asset {
  _type: string
  asset: Reference
}
