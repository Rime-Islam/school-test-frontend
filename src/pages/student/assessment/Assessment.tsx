import AssessmentCard from "../../../components/assessment/AssessmentCard";
import {
  useGetAssessmentSessionsByUserMutation,
  useGetUserAssessmentSessionsQuery,
} from "../../../redux/features/assessment/assessmentApi";
import { useGetAllQuestionsQuery } from "../../../redux/features/question/questionApi";

export default function AssessmentPage() {
  const {
    data: assessments,
    isLoading: isCheckingAssessments,
    refetch,
  } = useGetUserAssessmentSessionsQuery(undefined);

  const [
    triggerAssessment,
    { isLoading: isCreatingAssessment, isError: createAssessmentError },
  ] = useGetAssessmentSessionsByUserMutation();

  const currentStep = assessments?.data?.[0]?.currentStep;
  const highestCertifiedLevels = assessments?.data?.[0]?.highestCertifiedLevels;

  const levelQueryParam = highestCertifiedLevels?.join(", ") || undefined;
  const {
    data,
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = useGetAllQuestionsQuery({
    page: 1,
    limit: 50,
    level: levelQueryParam,
  });

  const handleTakeAssessment = async () => {
    try {
      await triggerAssessment({}).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to create assessment:", error);
    }
  };

  if (isCheckingAssessments) {
    return <div>Loading assessment data...</div>;
  }

  const hasExistingAssessments =
    assessments?.data && assessments?.data?.length > 0;

  return (
    <div>
      <div>
        {!hasExistingAssessments && (
          <div>
            <button
              type="button"
              onClick={handleTakeAssessment}
              disabled={isCreatingAssessment}
              className={`px-4 py-2 rounded text-white ${
                isCreatingAssessment
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {isCreatingAssessment
                ? "Creating Assessment..."
                : "Take Assessment"}
            </button>
            {createAssessmentError && (
              <p className="mt-2 text-red-500">Failed to start assessment</p>
            )}
          </div>
        )}

        <div className="mt-3">
          {isQuestionsLoading && (
            <div className="text-center py-4">
              <p>Loading assessment data...</p>
            </div>
          )}

          {questionsError && (
            <div className="alert alert-error">Error loading questions</div>
          )}

          {hasExistingAssessments && !isQuestionsLoading && !questionsError && (
            <AssessmentCard
              currentStep={currentStep}
              answers={assessments?.data?.answers}
              questions={data?.data}
            />
          )}
        </div>
      </div>
    </div>
  );
}
