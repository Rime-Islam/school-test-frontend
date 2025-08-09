import { useState, useEffect } from "react";

export default function AssessmentPage() {
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="max-w-2xl w-full">
        {/* Title & Instructions */}
        <h1 className="text-2xl font-bold mb-1">Assessment</h1>
        <p className="text-gray-600 mb-4">
          Answer each question before the timer runs out. You can skip a
          question to move forward.
        </p>

        {/* Step & Timer */}
        <div className="bg-white border rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Step 1 of 3</span>
            <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold">
              {timeLeft}s
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: "66%" }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          {/* Category & Level */}
          <p className="text-sm text-gray-500 mb-1">
            VOCABULARY • Level B1
          </p>
          <h2 className="text-lg font-medium mb-4">
            Vocabulary: Select the synonym of 'rapid'.
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {["slow", "fast", "dull", "late"].map((option) => (
              <label
                key={option}
                className={`flex items-center border rounded-lg px-4 py-2 cursor-pointer transition ${
                  selectedOption === option
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => setSelectedOption(option)}
                  className="mr-3"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-4">
          <button className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">
            Skip
          </button>
          <button
            className={`px-4 py-2 rounded text-white transition ${
              selectedOption
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!selectedOption}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
