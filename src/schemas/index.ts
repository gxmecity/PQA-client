import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is reuired',
    })
    .min(1, 'Email is required')
    .email({ message: 'Enter a valid email address' }),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(1, 'Password is required'),
})

//Quiz Schemas

export const createQuizSchema = z.object({
  title: z
    .string({
      required_error: 'Title is reuired',
    })
    .min(1, 'Title is required'),
  description: z.string({
    required_error: 'Password is required',
  }),
})

const ReferenceSchema = z.object({
  _ref: z.string(),
  _type: z.string(),
})

const AssetSchema = z.object({
  _type: z.string(),
  asset: ReferenceSchema,
})

const AnswerSchema = z.object({
  answer_text: z.string(),
})

const QuestionQuestionSchema = z.object({
  question_text: z.string(),
  number: z.number(),
  question_type: z.string(),
  question_image: AssetSchema.optional(),
  multi_choice_options: z.array(z.string()).optional(),
  question_video: AssetSchema.optional(),
  standalone_asset: z.boolean().default(false),
  asset_type: z.string().default('image'),
})

export const QuestionElementSchema = z.object({
  _type: z.string(),
  _key: z.string().optional(),
  answer: AnswerSchema,
  question: QuestionQuestionSchema,
})

export const RoundSchema = z.object({
  round_name: z.string(),
  round_type: z.string(),
  _type: z.string(),
  questions: z.array(QuestionElementSchema),
  _key: z.string().optional(),
  category: z.string(),
  timer: z.number(),
})

export const updateQuizSchema = z.object({})
