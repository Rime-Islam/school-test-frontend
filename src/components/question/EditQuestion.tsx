import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import {
    useGetQuestionByIdQuery,
  useUpdateQuestionMutation,
} from '../../redux/features/question/questionApi';
import type { QuestionFormData, CreateQuestionPayload } from '../../interface/question.interface';

const COMPETENCIES = ["grammar", "vocabulary", "writing"];
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const MAX_OPTIONS = 8;

export default function EditQuestion() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: questionData, isLoading: isFetching } = useGetQuestionByIdQuery(id as string, { skip: !id });
  const [updateQuestion, { isLoading: isUpdating, isSuccess, isError }] = useUpdateQuestionMutation();
  const question = questionData?.data;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<QuestionFormData>({
    defaultValues: {
      text: '',
      competency: '',
      level: '',
      timeLimit: 60,
      options: [{ text: '' }, { text: '' }],
      correctIndex: -1
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options'
  });

  const correctIndex = watch('correctIndex');
  const options = watch('options');
  const canAddOption = fields.length < MAX_OPTIONS;

  // Populate form when data is fetched
useEffect(() => {
  if (question) {
    const correctIndexFromApi = question.options.findIndex(
      (opt: any) => opt.isCorrect
    );

    reset({
      text: question.text,
      competency: question.competency,
      level: question.level,
      timeLimit: question.timeLimit,
      options: question.options.map((opt: any) => ({
        text: opt.text
      })),
      correctIndex: correctIndexFromApi >= 0 ? correctIndexFromApi : -1
    });
  }
}, [question, reset]);

  const onSubmit = async (data: QuestionFormData) => {
    if (data.correctIndex < 0 || data.correctIndex >= data.options.length) {
      setErrorMessage('Please select the correct answer');
      return;
    }

    const payload: CreateQuestionPayload = {
      text: data.text,
      competency: data.competency,
      level: data.level,
      timeLimit: data.timeLimit,
      options: data?.options?.map((option, index) => ({
        text: option.text,
        isCorrect: index === data.correctIndex
      }))
    };

    try {
      await updateQuestion({ id: id, data: payload }).unwrap();
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error.data?.message || 'Failed to update question');
    }
  };

  if (isFetching) {
    return <div className="p-6">Loading question...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 border border-gray-200 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Edit Question</h2>
      <p className='text-xs text-gray-500 font-semibold'>Modify the question, answers, level, and time limit.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium mb-1">Question</label>
          <textarea
            {...register('text', { required: 'Question text is required' })}
            className="w-full text-sm p-2 border border-gray-200 rounded focus:ring-2 focus:ring-gray-300"
            rows={4}
          />
          {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text.message}</p>}
        </div>

        {/* Competency, Level, Time Limit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Competency</label>
            <select
              {...register('competency', { required: 'Competency is required' })}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              {COMPETENCIES.map((comp) => (
                <option key={comp} value={comp}>
                  {comp.charAt(0).toUpperCase() + comp.slice(1)}
                </option>
              ))}
            </select>
            {errors.competency && <p className="text-red-500 text-sm mt-1">{errors.competency.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Level</label>
            <select
              {...register('level', { required: 'Level is required' })}
              className="w-full p-2 border border-gray-300 text-sm rounded"
            >
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time Limit (seconds)</label>
            <input
              type="number"
              {...register('timeLimit', { 
                required: 'Time limit is required',
                min: { value: 60, message: 'Minimum 60 seconds' },
                max: { value: 600, message: 'Maximum 600 seconds' }
              })}
              className="w-full p-2 border border-gray-300 text-sm rounded"
            />
            {errors.timeLimit && <p className="text-red-500 text-sm mt-1">{errors.timeLimit.message}</p>}
          </div>
        </div>

        {/* Options Section */}
        <div>
          <label className="block text-sm font-medium mb-1">Options (choose one correct)</label>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-gray-300 rounded-lg p-3 bg-white">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={correctIndex === index}
                    onChange={() => setValue('correctIndex', index, { shouldValidate: true })}
                    className="h-4 w-4 text-gray-300 focus:ring-gray-400"
                  />
                  <div className="flex-1">
                    <input
                      {...register(`options.${index}.text`, { required: 'Option cannot be empty' })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400"
                      placeholder={`Option ${index + 1}`}
                    />
                    {errors.options?.[index]?.text && (
                      <p className="mt-1 text-sm text-red-600">{errors.options[index]?.text?.message}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const current = correctIndex;
                      remove(index);
                      if (current === index) {
                        setValue('correctIndex', -1, { shouldValidate: true });
                      } else if (current > index) {
                        setValue('correctIndex', current - 1, { shouldValidate: true });
                      }
                    }}
                    disabled={fields.length <= 2}
                    className="p-2 text-red-600 hover:text-red-800 disabled:text-gray-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {errorMessage && (
            <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
          )}

          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={() => append({ text: '' })}
              disabled={!canAddOption}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:text-gray-200 disabled:bg-gray-50"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add option
            </button>
            <span className="text-xs text-gray-500">
              Minimum 2 options. Maximum {MAX_OPTIONS}.
            </span>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 justify-end items-center pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm text-gray-900 hover:bg-gray-300 hover:rounded font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:bg-gray-300"
          >
            {isUpdating ? 'Updating...' : 'Update Question'}
          </button>
        </div>

        {/* Status Messages */}
        {isSuccess && (
          <div className="p-3 bg-green-100 text-green-700 rounded">
            Question updated successfully!
          </div>
        )}
        {isError && !errorMessage && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            Failed to update question
          </div>
        )}
      </form>
    </div>
  );
}
