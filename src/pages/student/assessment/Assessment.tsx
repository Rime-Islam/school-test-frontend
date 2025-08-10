import { toast } from "sonner";
import AssessmentCard from "../../../components/assessment/AssessmentCard";
import {
  useGetAssessmentSessionsByUserMutation,
  useGetResultMutation,
  useGetUserAssessmentSessionsQuery,
} from "../../../redux/features/assessment/assessmentApi";
import { useGetAllQuestionsQuery } from "../../../redux/features/question/questionApi";
import { useState } from "react";

export default function AssessmentPage() {
  const {
    data: assessments,
    isLoading: isCheckingAssessments,
    refetch,
  } = useGetUserAssessmentSessionsQuery(undefined);

  const assessmentId = assessments?.data[0]?._id;
  const status = assessments?.data[0]?.status;
  const currentStep = assessments?.data[0]?.currentStep;
  const highestCertifiedLevels = assessments?.data[0]?.highestCertifiedLevels;

  const [
    triggerAssessment,
    { isLoading: isCreatingAssessment, isError: createAssessmentError },
  ] = useGetAssessmentSessionsByUserMutation();
  const [patchResult] = useGetResultMutation();

  const levelQueryParam = highestCertifiedLevels?.join(", ") || undefined;
  const {
    data,
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = useGetAllQuestionsQuery({
    page: 1,
    limit: 7,
    level: levelQueryParam,
  });

  const [showAssessment, setShowAssessment] = useState(
    status === "in-progress"
  );

  const handleStart = () => setShowAssessment(true);

  const handleTakeAssessment = async () => {
    try {
      await triggerAssessment({}).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to create assessment:", error);
    }
  };

  const handleProcessResult = async () => {
    if (!assessmentId) return;
    try {
      const result = await patchResult(assessmentId);
      if (result?.data?.success) {
        toast.success(result?.data?.message);
        refetch();
      }
    } catch (error) {
      console.error("Processing error:", error);
    }
  };

  if (isCheckingAssessments) {
    return <div>Loading assessment data...</div>;
  }

  const hasExistingAssessments =
    assessments?.data && assessments?.data?.length > 0;

  return (
    <div>
      {assessments?.data[0].answers.length > 0 ? (
        <button
          type="button"
          className="px-4 py-2 rounded text-white bg-emerald-600 hover:bg-emerald-700"
          onClick={handleProcessResult}
        >
          Process my result
        </button>
      ) : (
        !hasExistingAssessments && (
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
              {isCreatingAssessment ? "Creating..." : "Take Assessment"}
            </button>
            {createAssessmentError && (
              <p className="mt-2 text-red-500">Failed to start assessment</p>
            )}
          </div>
        )
      )}

      {/* existing assessments */}
      {hasExistingAssessments && (
        <div className="mt-3">
          {status === "proceed" &&
          !showAssessment &&
          assessments?.data[0].currentStep < 3 ? (
            <div className="text-center my-6">
              <h1 className="text-xl font-semibold mb-4">
                Your result is above 75, you are qualified to take the next
                assessment.
              </h1>
              <button
                type="button"
                onClick={handleStart}
                className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
              >
                Take Next Step Assessment
              </button>
            </div>
          ) : (
            status === "proceed" &&
            !showAssessment && (
              <div className="text-center my-4">
                <p className="mb-3 text-gray-700">
                  You have successfully completed this assessment. Great job!
                </p>
                <button
                  type="button"
                  className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
                  disabled
                >
                  Assessment Completed
                </button>
              </div>
            )
          )}

          {status === "completed" && !showAssessment && (
      <div>
    <p className="mb-2 text-yellow-700 font-semibold">
      Your score is between 50 and 75. You can retake the assessment to improve your level.
    </p>
    <button
      type="button"
      onClick={handleStart}
      className="px-4 py-2 rounded text-white bg-emerald-600 hover:bg-emerald-700"
    >
      Retake Assessment
    </button>
  </div>
          )}

          {status === "abandoned" && (
            <p className="text-red-500 font-semibold">
              No retake — you have failed.
            </p>
          )}

          {(showAssessment ||
            (status === "in-progress" &&
              assessments?.data[0]?.answers?.length === 0)) &&
            !isQuestionsLoading &&
            !questionsError && (
              <AssessmentCard
                currentStep={currentStep}
                questions={data?.data}
              />
            )}
        </div>
      )}
    </div>
  );
}
