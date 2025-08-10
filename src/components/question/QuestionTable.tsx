import { useState } from "react";
import {
  useDeleteQuestionMutation,
  useGetAllQuestionsQuery,
} from "../../redux/features/question/questionApi";
import type { IQuestion } from "../../interface/question.interface";
import { Link } from "react-router-dom";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import PaginationWithButton from "../pagination";
import ConfirmModal from "./ConfirmModal";

const competencyOptions = [
  { label: "Grammar", value: "grammar" },
  { label: "Vocabulary", value: "vocabulary" },
  { label: "Writing", value: "writing" },
];

const levelOptions = [
  { label: "A1", value: "A1" },
  { label: "A2", value: "A2" },
  { label: "B1", value: "B1" },
  { label: "B2", value: "B2" },
  { label: "C1", value: "C1" },
  { label: "C2", value: "C2" },
];

const QuestionTable = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  // Filters state
  const [filters, setFilters] = useState({
    competency: "",
    level: "",
  });
  const { competency, level } = filters;

  const { data, isLoading, error } = useGetAllQuestionsQuery({
    page: pagination.page,
    limit: pagination.limit,
    competency: competency || undefined,
    level: level || undefined,
  });

  const handleFilterChange = (key: "competency" | "level", value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({ competency: "", level: "" });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const [deleteQuestion] = useDeleteQuestionMutation();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteQuestion(id).unwrap();
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("Failed to delete question:", err);
    }
  };

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 border border-red-300 rounded-md">
        Error loading questions. Please try again later.
      </div>
    );
  }

  return (
    <div className="rounded-md bg-white shadow-sm p-6">
      {/* Filter Section */}
      <div className="mb-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        {/* Competency Filter */}
        <div>
          <label
            htmlFor="competency"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Competency
          </label>
          <select
            id="competency"
            className="w-full rounded border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.competency}
            onChange={(e) => handleFilterChange("competency", e.target.value)}
          >
            <option value="">All</option>
            {competencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Level Filter */}
        <div>
          <label
            htmlFor="level"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Level
          </label>
          <select
            id="level"
            className="w-full rounded border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.level}
            onChange={(e) => handleFilterChange("level", e.target.value)}
          >
            <option value="">All</option>
            {levelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div>
          <button
            onClick={resetFilters}
            className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 rounded px-4 py-2 text-sm font-medium transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Index",
                "Created By",
                "Question",
                "Competency",
                "Level",
                "Time Limit",
                "Options",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-1 py-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider select-none"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-2 py-4 text-center text-gray-500">
                  Loading questions...
                </td>
              </tr>
            ) : data?.data?.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-2 py-4 text-center text-gray-500">
                  No questions found
                </td>
              </tr>
            ) : (
              data?.data?.map((question: IQuestion, index: number) => (
                <tr
                  key={question._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-2 py-1 whitespace-nowrap text-sm font-medium text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap capitalize text-sm text-gray-600">
                    {question.createdBy.name}
                  </td>
           <td className="px-2 py-1 max-w-48 overflow-hidden break-words capitalize text-sm text-gray-600">
  {question.text}
</td>
                  <td className="px-2 py-1 whitespace-nowrap capitalize text-sm text-gray-600">
                    {question.competency}
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-600">
                    {question.level}
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-600">
                    {question.timeLimit}s
                  </td>
                  <td className="px-2 py-1 max-w-xs whitespace-normal text-sm text-gray-700">
                    <div className="flex flex-col gap-1">
                      {question.options.map((option, i) => (
                        <span
                          key={i}
                          className={`${
                            option.isCorrect
                              ? "font-semibold text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          {option.text}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2 relative">
                      <Link
                        to={`/admin/dashboard/questions/${question._id}`}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition"
                        aria-label="Edit question"
                      >
                        <Edit2Icon className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() =>
                          setConfirmDeleteId(
                            confirmDeleteId === question._id
                              ? null
                              : question._id
                          )
                        }
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition"
                        aria-label="Delete question"
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </button>

                      {/* Confirmation Popup */}
                      <ConfirmModal
                        isOpen={!!confirmDeleteId}
                        title="Delete Question"
                        message="Are you sure you want to delete this question?"
                        onCancel={() => setConfirmDeleteId(null)}
                        onConfirm={() => {
                          if (confirmDeleteId) {
                            handleDelete(confirmDeleteId);
                            setConfirmDeleteId(null);
                          }
                        }}
                        confirmText="Delete"
                        cancelText="Cancel"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-5 flex justify-center">
        {data?.meta && (
          <PaginationWithButton
            limit={pagination.limit}
            page={pagination.page}
            setPage={(page) => setPagination((prev) => ({ ...prev, page }))}
            total={data.meta.total}
          />
        )}
      </div>
    </div>
  );
};

export default QuestionTable;
