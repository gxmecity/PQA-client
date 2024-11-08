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
import FormSelect from './FormSelect'
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

const roundTypes: SelectOptionType[] = [
  {
    name: 'Trivia',
    value: 'trivia',
  },
  {
    name: "Dealer's Choice",
    value: 'dealers_choice',
  },
]

const roundCategoryOptions: SelectOptionType[] = [
  {
    name: 'Arts & Culture',
    value: 'Arts & Culture',
  },
  {
    name: 'Entertainment',
    value: 'Entertainment',
  },
  {
    name: 'History',
    value: 'History',
  },
  {
    name: 'Nature & Geography',
    value: 'Nature & Geography',
  },
  {
    name: 'Science & Technology',
    value: 'Science & Technology',
  },
  {
    name: 'Sports & Leisure',
    value: 'Sports & Leisure',
  },
  {
    name: 'General Knowledge',
    value: 'General Knowledge',
  },
]

interface Props {
  data: Round
}

const RoundItem = ({ data }: Props) => {
  const [edit, setEdit] = useState(data._key ? true : false)
  const [activeQuestionIndex, setactiveQuestionIndex] = useState<number | null>(
    null
  )

  const form = useForm({
    resolver: zodResolver(RoundSchema),
    defaultValues: {
      round_name: data.round_name,
      round_type: data.round_type,
      _type: 'game_round',
      questions: data.questions,
      category: data.category,
      timer: data.timer,
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

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log(data)
  }

  form.watch()

  return (
    <Card className=''>
      {edit ? (
        <>
          <CardHeader>
            <CardTitle>Edit Round Details</CardTitle>
          </CardHeader>
          <FormProvider {...form}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className=' '>
                <CardContent className='flex flex-col gap-5'>
                  <div className=' grid grid-cols-4 gap-4 md:grid-cols-2 sm:grid-cols-1'>
                    <FormInput
                      name='round_name'
                      form={form}
                      type='text'
                      label='Round Title'
                    />
                    <FormSelect
                      name='round_type'
                      form={form}
                      label='Round Type'
                      options={roundTypes}
                    />
                    <FormSelect
                      name='category'
                      form={form}
                      label='Category'
                      options={roundCategoryOptions}
                    />
                    <FormInput
                      name='timer'
                      form={form}
                      type='number'
                      label='Time per question (seconds)'
                    />
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
                          _type: 'question',
                          _key: '',
                          answer: { answer_text: '' },
                          question: {
                            question_text: '',
                            number: questionsField.length + 1,
                            question_type: '',
                            multi_choice_options: ['', '', '', ''],
                            standalone_asset: false,
                            asset_type: 'image',
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
                      onClick={() => setEdit(false)}
                      icon={<Save />}
                    />
                    <AppButton variant='outline' text='Cancel' />
                  </div>
                </CardFooter>
              </form>
            </Form>
          </FormProvider>
        </>
      ) : (
        <>
          {' '}
          <CardHeader>
            <CardTitle className='mb-2'>{data.round_name}</CardTitle>
            <CardDescription className=' text-xs italic flex gap-2'>
              <span className=' border-r border-r-border pr-2'>
                Questions: {data.questions.length}
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
                onClick={() => setEdit(true)}
                icon={<Pencil />}
              />
              <AppButton variant='destructive' text='Remove' icon={<Trash />} />
            </div>
          </CardContent>
        </>
      )}
    </Card>
  )
}

export default RoundItem
