;import { useState } from 'react';
import { useDeleteQuestionMutation, useGetAllQuestionsQuery } from '../../redux/features/question/questionApi';
import type { IQuestion } from '../../interface/question.interface';
import { Link } from 'react-router-dom';


const QuestionTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isLoading, error } = useGetAllQuestionsQuery({ page, limit });
  const [deleteQuestion] = useDeleteQuestionMutation();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteQuestion(id).unwrap();
      setConfirmDeleteId(null);
    } catch (err) {
      console.error('Failed to delete question:', err);
    }
  };

  if (error) {
    return (
      <div className="p-4 text-red-500 border border-red-200 rounded bg-red-50">
        Error loading questions. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-4">
 
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Competency
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Level
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time Limit
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Options
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  Loading questions...
                </td>
              </tr>
            ) : data?.data?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  No questions found
                </td>
              </tr>
            ) : (
              data?.data?.map((question: IQuestion) => (
                <tr key={question._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-normal max-w-xs">
                    <div className="line-clamp-2">{question.text}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    {question.competency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {question.level}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {question.timeLimit}s
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {question.options.map((option, i) => (
                        <span
                          key={i}
                          className={`text-sm ${option.isCorrect ? 'font-bold text-green-600' : 'text-gray-600'}`}
                        >
                          {option.text}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Link
                        to={`/questions/edit/${question._id}`}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                      >
                        {/* <FiEdit2 className="w-5 h-5" /> */}
                      </Link>
                      <button
                        onClick={() => setConfirmDeleteId(question._id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      >
                        {/* <FiTrash2 className="w-5 h-5" /> */}
                      </button>
                    </div>
                    {confirmDeleteId === question._id && (
                      <div className="absolute mt-2 right-0 mr-6 p-3 bg-white border border-gray-200 rounded shadow-lg z-10">
                        <p className="mb-2">Delete this question?</p>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDelete(question._id)}
                            className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.meta && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <div className="text-sm text-gray-600">
            Showing {data.meta.page} to {Math.ceil(data.meta.total / data.meta.limit)} of {data.meta.total} questions
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * limit >= (data.meta?.total || 0)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="border rounded"
            >
              {[10, 20, 50].map(size => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionTable;