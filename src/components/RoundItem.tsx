import { RoundSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus, Save, Trash } from 'lucide-react'
import { useState } from 'react'
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import AppButton from './AppButton'
import { SelectOptionType } from './AppSelect'
import FormInput from './FormInput'
import QuestionItem from './QuestionItem'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Form } from './ui/form'
import FormRadio from './FormRadio'
import {
  useAddQuizRoundMutation,
  useDeleteQuizRoundMutation,
  useUpdateQuizRoundDetailsMutation,
} from '@/services/quiz'
import { errorResponseHandler } from '@/lib/utils'
import { toast } from 'sonner'

const roundTypes: SelectOptionType[] = [
  {
    name: 'Trivia',
    value: 'trivia',
    description:
      'Regular quiz round with questions asked in quick succession. All feedback is shown at the end of the round',
  },
  {
    name: "Dealer's Choice",
    value: 'dealers_choice',
    description:
      'Players take turn picking a question number. Answers reveal after question timer elapsed.',
  },
]

interface Props {
  data: Round
  quiz_id: string
  activeIndex: number | null
  index: number
  setActiveIndex: (arg: number | null) => void
}

const RoundItem = ({
  data,
  quiz_id,
  activeIndex,
  index,
  setActiveIndex,
}: Props) => {
  const [addQuizRound, { isLoading: adding }] = useAddQuizRoundMutation()
  const [updateQuizRound, { isLoading: updating }] =
    useUpdateQuizRoundDetailsMutation()
  const [deleteQuizRound, { isLoading: deleting }] =
    useDeleteQuizRoundMutation()

  const [activeQuestionIndex, setactiveQuestionIndex] = useState<number | null>(
    null
  )

  const form = useForm({
    resolver: zodResolver(RoundSchema),
    defaultValues: {
      round_name: data.round_name,
      round_type: data.round_type,
      questions: data.questions,
      timer: data.timer.toString(),
    },
  })

  const {
    fields: questionsField,
    append: addQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: 'questions',
  })

  const onSubmit: SubmitHandler<any> = async (roundData) => {
    try {
      if (data._id) {
        await updateQuizRound({
          id: quiz_id,
          data: roundData,
          round_id: data._id,
        }).unwrap()
        toast.success('Round Updated', {
          description: 'Quiz round updated successfully',
        })
      } else {
        await addQuizRound({
          id: quiz_id,
          data: roundData,
        }).unwrap()

        toast.success('Round Added', {
          description: 'New round added to quiz successfully',
        })
      }
      setActiveIndex(null)
      setactiveQuestionIndex(null)
    } catch (error: any) {
      errorResponseHandler(error)
    }
  }

  const handleDeleteRound = async () => {
    //TODO: Handle remove rounds without ID

    try {
      await deleteQuizRound({
        id: quiz_id,
        round_id: data._id,
      }).unwrap()
      toast.success('Round Deleted', {
        description: 'Quiz round deleted successfully',
      })
    } catch (error: any) {
      errorResponseHandler(error)
    }
  }

  form.watch()

  return (
    <Card>
      {activeIndex === index ? (
        <>
          <CardHeader>
            <CardTitle>Edit Round Details</CardTitle>
          </CardHeader>
          <FormProvider {...form}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className=' '>
                <CardContent className='flex flex-col gap-5'>
                  <div className=' flex items-center gap-4 flex-wrap'>
                    <div className=' basis-1/3 sm:basis-full '>
                      <FormInput
                        name='round_name'
                        form={form}
                        type='text'
                        label='Round Title'
                      />
                    </div>
                    <div className=' basis-1/2 sm:basis-full'>
                      <FormRadio
                        form={form}
                        options={roundTypes}
                        label='Round Type'
                        name='round_type'
                      />
                    </div>

                    <div className='flex-auto'>
                      <FormInput
                        name='timer'
                        form={form}
                        type='number'
                        label='Time per question (seconds)'
                      />
                    </div>
                  </div>
                  <div className=' flex flex-col gap-3'>
                    {questionsField.map((question, index) => (
                      <QuestionItem
                        key={question.id}
                        index={index}
                        activeQuestionIndex={activeQuestionIndex}
                        setactiveQuestionIndex={setactiveQuestionIndex}
                        form={form}
                        handleDelete={() => removeQuestion(index)}
                      />
                    ))}
                  </div>
                  <div className=' flex items-center gap-3 justify-center sm:flex-col'>
                    <AppButton
                      text='Add Blank Question'
                      icon={<Plus />}
                      variant='outline'
                      classname='border-primary text-primary'
                      onClick={() => {
                        addQuestion({
                          _id: '',
                          answer: { answer_text: '', is_blackbox: false },
                          question: {
                            question_text: '',
                            question_type: '',
                            multi_choice_options: ['', '', '', ''],
                            standalone_media: false,
                            question_media: {
                              url: '',
                              type: '',
                            },
                          },
                        })

                        setactiveQuestionIndex(questionsField.length)
                      }}
                    />
                    <AppButton
                      text='Import from csv file'
                      icon={<Plus />}
                      variant='outline'
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <div className=' flex gap-3 sm:flex-col'>
                    <AppButton
                      text='Save'
                      icon={<Save />}
                      type='submit'
                      loading={adding || updating}
                    />
                    <AppButton
                      variant='outline'
                      text='Cancel'
                      onClick={() => {
                        form.reset()
                        setActiveIndex(null)
                        setactiveQuestionIndex(null)
                      }}
                    />
                  </div>
                </CardFooter>
              </form>
            </Form>
          </FormProvider>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle className='mb-2'>{data.round_name}</CardTitle>
            <CardDescription className=' text-xs italic flex gap-2'>
              <span className=' border-r border-r-border pr-2'>
                Questions: {questionsField.length}
              </span>
              <span className=' border-r border-r-border pr-2'>
                Questions mode: {data.round_type}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className=' flex gap-3 sm:flex-col'>
              <AppButton
                text='Edit'
                onClick={() => setActiveIndex(index)}
                icon={<Pencil />}
              />
              <AppButton
                variant='destructive'
                text='Remove'
                icon={<Trash />}
                onClick={handleDeleteRound}
                loading={deleting}
              />
            </div>
          </CardContent>
        </>
      )}
    </Card>
  )
}

export default RoundItem
