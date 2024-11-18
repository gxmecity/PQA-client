import { UploadCloud, XIcon } from 'lucide-react'
import { SelectOptionType } from './AppSelect'
import FormCheckbox from './FormCheckbox'
import FormInput from './FormInput'
import FormSelect from './FormSelect'
import { Input } from './ui/input'
import { Label } from './ui/label'
import FormRadio from './FormRadio'
import UploadWidget from './UploadWidjet'
import { useState } from 'react'
import { handleDeleteAsset } from '@/cloudinary'

interface Props {
  activeQuestionIndex: number | null
  setactiveQuestionIndex: (arg: number | null) => void
  index: number
  form: any
  handleDelete: () => void
}

const questionTypes: SelectOptionType[] = [
  {
    name: 'Open Question',
    value: 'open_question',
  },
  {
    name: 'Multiple Choice',
    value: 'multiple_choice',
  },
  {
    name: 'True or False',
    value: 'true_or_false',
  },
  {
    name: 'Question Only',
    value: 'question_only',
  },
]

const truthyOptions: SelectOptionType[] = [
  {
    name: 'True',
    value: 'true',
  },
  {
    name: 'False',
    value: 'false',
  },
]

const QuestionItem = ({
  activeQuestionIndex,
  index,
  form,
  setactiveQuestionIndex,
  handleDelete,
}: Props) => {
  const questionText =
    form.getValues('questions')[index]['question']['question_text']
  const answer = form.getValues('questions')[index]['answer']['answer_text']
  const type = form.getValues('questions')[index]['question']['question_type']
  const assetType =
    form.getValues('questions')[index]['question']['question_media']['type']
  const assetUrl =
    form.getValues('questions')[index]['question']['question_media']['url']

  function handleOnUpload(error: any, result: any, widget: any) {
    if (error) return

    form.setValue(
      `questions[${index}].question.question_media.url`,
      result?.info?.secure_url
    )
    form.setValue(
      `questions[${index}].question.question_media.type`,
      result?.info?.resource_type
    )
    widget.close({
      quiet: true,
    })
  }

  const deleteUploadedAsset = () => {
    form.setValue(`questions[${index}].question.question_media.url`, '')
    form.setValue(`questions[${index}].question.question_media.type`, '')
  }

  const setAnswer = (arg: string) => {
    if (arg) form.setValue(`questions[${index}].answer.answer_text`, arg)
  }

  return (
    <div className=' bg-secondary/25 px-3 rounded-sm shadow-md border border-border py-3'>
      {activeQuestionIndex === index ? (
        <div className=' relative'>
          <button
            onClick={handleDelete}
            type='button'
            className='absolute right-0 top-0 text-destructive'>
            <XIcon size={20} />
          </button>
          <div className=' grid grid-cols-2 gap-5 sm:grid-cols-1'>
            <FormInput
              form={form}
              name={`questions[${index}].question.question_text`}
              type='text'
              label='Question'
              placeholder='Write a clear question '
            />
            <FormSelect
              name={`questions[${index}].question.question_type`}
              form={form}
              label='Question Type'
              options={questionTypes}
            />
          </div>
          <Label className=' mb-3 block'>Question Attachment</Label>
          <div className=' grid grid-cols-3 gap-4 sm:grid-cols-1'>
            <div className=' flex items-center justify-center gap-5'>
              {assetType ? (
                <div className=' relative h-full w-full'>
                  <button
                    type='button'
                    onClick={deleteUploadedAsset}
                    className=' bg-black text-white top-2 right-2 w-5 h-5 rounded-full absolute flex items-center justify-center'>
                    <XIcon size={15} />
                  </button>
                  {assetType === 'image' && assetUrl && (
                    <img src={assetUrl} alt='Image' />
                  )}
                  {assetType === 'video' && assetUrl && (
                    <video>
                      <source src={assetUrl} type='video/mp4' />
                      Your browser dows not support video
                    </video>
                  )}
                </div>
              ) : (
                <UploadWidget onUpload={handleOnUpload}>
                  {({ open }) => {
                    return (
                      <button
                        type='button'
                        className=' flex items-center text-xs justify-center h-16 py-2 gap-3 border border-dashed border-primary rounded-md w-full cursor-pointer'
                        onClick={() => open()}>
                        <UploadCloud
                          className='text-primary h-full '
                          size={25}
                        />
                        Upload file
                      </button>
                    )
                  }}
                </UploadWidget>
              )}
            </div>
            <FormCheckbox
              form={form}
              label='Standalone attachment'
              description='Show only attachment with no question text'
              name={`questions[${index}].question.standalone_asset`}
            />
            <FormCheckbox
              form={form}
              label='Has Blackbox'
              description='Special questions for gifting player prices for correct answer'
              name={`questions[${index}].answer.is_blackbox`}
            />
          </div>
          {type === 'multiple_choice' && (
            <>
              <Label>Multiple Choice Options</Label>
              <div className='grid grid-cols-2 gap-3 mt-2 sm:grid-cols-1'>
                {[0, 1, 2, 3].map((optionIndex) => (
                  <div className=' flex gap-2' key={optionIndex}>
                    <FormInput
                      type='text'
                      form={form}
                      name={`questions[${index}].question.multi_choice_options[${optionIndex}]`}
                    />
                    <button
                      type='button'
                      className=' text-xs'
                      onClick={() =>
                        setAnswer(
                          form.getValues('questions')[index]['question'][
                            'multi_choice_options'
                          ][optionIndex]
                        )
                      }>
                      {answer &&
                      answer ===
                        form.getValues('questions')[index]['question'][
                          'multi_choice_options'
                        ][optionIndex]
                        ? 'Correct'
                        : 'Wrong'}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
          {type === 'true_or_false' && (
            <FormRadio
              form={form}
              label='Correct Answer'
              name={`questions[${index}].answer.answer_text`}
              options={truthyOptions}
            />
          )}
          {type === 'open_question' && (
            <FormInput
              type='text'
              form={form}
              name={`questions[${index}].answer.answer_text`}
              label='Correct Answer'
            />
          )}
        </div>
      ) : (
        <div
          className=' cursor-pointer h-10 flex items-center gap-3 text-xs'
          onClick={() => setactiveQuestionIndex(index)}>
          <span className=' w-5 h-5 rounded-full bg-primary/70 flex items-center justify-center'>
            {index + 1}
          </span>{' '}
          <span className=' truncate'>{questionText || 'Empty Question'}</span>
          <span className=' italic truncate'>{answer}</span>
        </div>
      )}
    </div>
  )
}

export default QuestionItem
