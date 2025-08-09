import { Link } from "react-router-dom";
import QuestionTable from "../../../components/question/QuestionTable";

const AllQuestion = () => {
  return (
    <div>
      <div className="flex justify-between gap-4 flex-wrap items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-600">All Questions</h1>

        <Link to="/admin/dashboard/create-question">
          <button
            type="button"
            className="h-8 rounded-md bg-gray-800 px-2.5 text-xs font-medium text-white hover:bg-gray-700"
          >
            Create Question
          </button>
        </Link>
      </div>
      <div>
        <QuestionTable />
      </div>
    </div>
  );
};

export default AllQuestion;
