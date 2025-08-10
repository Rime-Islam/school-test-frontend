import { useCallback, useEffect, useState } from "react";
import type {
  AssessmentCardProps,
  IAssessmentAnswer,
} from "../../interface/assessment.interface";
import { loadFromStorage, saveToStorage } from "../../utils/localStorage";
import { useCreateAssessmentSessionMutation } from "../../redux/features/assessment/assessmentApi";

const AssessmentCard = ({
  currentStep,
  questions = [],
}: AssessmentCardProps) => {
      const [createAssessmentSession] = useCreateAssessmentSessionMutation();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() =>
    loadFromStorage("assessment_currentQuestionIndex", 0)
  );
  const [userAnswers, setUserAnswers] = useState<IAssessmentAnswer[]>(() =>
    loadFromStorage("assessment_userAnswers", [])
  );

  // Other states don't need persistence
  const [timeLeft, setTimeLeft] = useState(() =>
    loadFromStorage("assessment_timeLeft", 60)
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(() =>
    loadFromStorage("assessment_selectedOption", null)
  );
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    saveToStorage("assessment_currentQuestionIndex", currentQuestionIndex);
  }, [currentQuestionIndex]);

useEffect(() => {

  if (questions.length > userAnswers.length  ) {
    saveToStorage("assessment_userAnswers", userAnswers);
  }
}, [userAnswers, questions.length]);

  useEffect(() => {
    saveToStorage("assessment_timeLeft", timeLeft);
  }, [timeLeft]);

  useEffect(() => {
    saveToStorage("assessment_selectedOption", selectedOption);
  }, [selectedOption]);

  const saveCurrentAnswer = useCallback(() => {
    if (!currentQuestion) return;

    const newAnswer: IAssessmentAnswer = {
      questionId: currentQuestion._id,
      selectedAnswer: selectedOption || "",
      isCorrect: selectedOption
        ? currentQuestion.options.find((opt) => opt.text === selectedOption)
            ?.isCorrect || false
        : false,
    };

    setUserAnswers((prev) => {
      const existingIndex = prev.findIndex(
        (a) => a.questionId === newAnswer.questionId
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAnswer;
        return updated;
      }
      return [...prev, newAnswer];
    });
  }, [currentQuestion, selectedOption]);

  const handleNextQuestion = useCallback(() => {
    setIsProcessing(true);
    saveCurrentAnswer();

    if (currentQuestionIndex < questions.length -1 ) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTimeLeft(60);
      setShowCorrectAnswer(false);
    }
    setIsProcessing(false);
  }, [currentQuestionIndex, questions.length, saveCurrentAnswer, userAnswers]);

  const handleOptionSelect = (optionText: string) => {
    setSelectedOption(optionText);
    setShowCorrectAnswer(true);
  };
  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleNextQuestion();
    }
  }, [timeLeft, handleNextQuestion]);

const handleFinishAssessment = async () => {
  if (!userAnswers || userAnswers.length === 0) return;
   setIsProcessing(true);
    saveCurrentAnswer();
  try {
    const res = await createAssessmentSession(userAnswers).unwrap();
    console.log('Submission result:', res.success);

    // Only clear storage if the submission was successful
    if (res?.success) {
        setIsProcessing(false)

      localStorage.removeItem("assessment_userAnswers");
      localStorage.removeItem("assessment_currentQuestionIndex");
      localStorage.removeItem("assessment_selectedOption");
      localStorage.removeItem("assessment_showCorrectAnswer");
      

      localStorage.removeItem("assessment_timeLeft");
      
     location.reload();
    }

  } catch (error) {
    console.error('Assessment submission failed:', error);
    // Optionally keep the data in localStorage for retry
  }
};

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-2xl font-bold mb-4">No questions available</h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center relative">
      <div className="max-w-2xl w-full">
        {/* Title & Instructions */}
        <h1 className="text-2xl font-bold mb-1">Assessment</h1>
        <p className="text-gray-600 mb-4">
          Answer each question before the timer runs out. You can't skip a
          question to move forward.
        </p>

        {/* Step & Timer */}
        <div className="bg-white border rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium flex gap-5">
              <span>Step {currentStep}</span>
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold">
              {timeLeft}s
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / questions?.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">
            {currentQuestion?.competency?.toUpperCase()} • Level{" "}
            {currentQuestion?.level}
          </p>
          <h2 className="text-lg font-medium mb-4">{currentQuestion?.text}</h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion?.options?.map((option) => {
              const isSelected = selectedOption === option?.text;
              const isCorrectOption = option?.isCorrect;
              const showAsCorrect = showCorrectAnswer && isCorrectOption;
              const showAsIncorrect =
                showCorrectAnswer && isSelected && !isCorrectOption;

              return (
                <label
                  key={option?.text}
                  className={`flex items-center border rounded-lg px-4 py-2 cursor-pointer transition ${
                    isSelected
                      ? showAsIncorrect
                        ? "border-red-500 bg-red-50"
                        : "border-blue-500 bg-blue-50"
                      : showAsCorrect
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option?.text}
                    checked={isSelected}
                    onChange={() => handleOptionSelect(option?.text)}
                    className="mr-3"
                    disabled={showCorrectAnswer}
                  />
                  {option.text}
                  {showAsCorrect && (
                    <span className="ml-auto text-emerald-600">✓ Correct</span>
                  )}
                  {showAsIncorrect && (
                    <span className="ml-auto text-red-600">✗ Incorrect</span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              className={`px-4 py-2 rounded text-white transition ${
                selectedOption
                  ? "bg-emerald-600 hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleNextQuestion}
              disabled={!selectedOption}
            >
              Next Question
            </button>
          ):   <button
             onClick={handleFinishAssessment}
              className={`px-4 py-2 rounded text-white transition ${
                selectedOption
                  ? "bg-emerald-600 hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                  : "bg-gray-400 cursor-not-allowed"
              }
              `
            }
            >
              Finish Assessment
            </button>
            }
        
        </div>
      </div>
    </div>
  );
};

export default AssessmentCard;
