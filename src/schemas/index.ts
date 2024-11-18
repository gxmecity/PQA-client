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

export const signupSchema = z
  .object({
    fullname: z
      .string({
        required_error: 'Fullname is reuired',
      })
      .min(1, 'Fullname is required'),
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
      .min(6, {
        message: 'Pasword must be at least 6 characters',
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message:
          'Password must have at least one uppercase letter, one lowercase letter, and one number',
      }),
    confirm_password: z
      .string({
        required_error: 'Confirm password is required',
      })
      .min(6, {
        message: 'Pasword must be at least 6 characters',
      }),

    terms: z.literal(true, {
      errorMap: () => ({
        message: 'Please accept the terms & conditions to continue',
      }),
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
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
  publish: z.boolean().default(false),
})

const AnswerSchema = z.object({
  answer_text: z.string(),
  is_blackbox: z.boolean().default(false),
})

const QuestionQuestionSchema = z.object({
  question_text: z.string(),
  question_type: z.string(),
  question_media: z
    .object({
      url: z.string(),
      type: z.string(),
    })
    .optional(),
  multi_choice_options: z.array(z.string()).optional(),
  standalone_asset: z.boolean().default(false),
})

export const QuestionElementSchema = z.object({
  answer: AnswerSchema,
  question: QuestionQuestionSchema,
})

export const RoundSchema = z.object({
  round_name: z.string().min(1, 'Round name is required'),
  round_type: z.string().min(5, 'Round type is required'),
  questions: z.array(QuestionElementSchema),
  timer: z.string(),
})

// Event Schema
export const createEventSchema = z.object({
  title: z
    .string({
      required_error: 'Title is reuired',
    })
    .min(1, 'Title is required'),
  description: z.string({
    required_error: 'Password is required',
  }),
  game: z.string(),
  scheduled_date: z.string(),
})
