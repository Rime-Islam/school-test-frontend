import { useGetUserAssessmentSessionsQuery } from "../../../redux/features/assessment/assessmentApi";


const Certificate = () => {
      const {
    data: assessments,
  } = useGetUserAssessmentSessionsQuery(undefined);

  const status = assessments?.data[0]?.status;
  const currentStep = assessments?.data[0]?.currentStep;
console.log(status)
console.log(currentStep)
console.log(assessments?.data[0])
const results = assessments?.data[0]?.results;
    return (
        <div>
            {
              results?.length &&  results?.map((result: any) => (
                      <div key={result?.certifiedLevel} className="max-w-3xl mx-auto my-8 p-8 border-8 border-gray-600 rounded-xl bg-gray-50 shadow-lg font-serif text-center">
      <h1 className="text-5xl text-emerald-600 mb-2 font-semibold">Certificate of Achievement</h1>

      <p className="text-lg text-gray-800 mb-8">This certifies that</p>

      <h2 className="text-4xl font-bold mb-4">{assessments?.data[0]?.userId?.name}</h2>

      <p className="text-xl mb-3">has successfully completed</p>

      <p className="text-2xl font-bold text-gray-900 mb-6">
        Step  of the Language Assessment
      </p>

      <p className="text-lg mb-2">
        <strong>Score:</strong> {result?.score}%
      </p>

      <p className="text-lg mb-8">
        <strong>Certified Level:</strong> {result?.certifiedLevel}
      </p>

      <div className="flex justify-around border-t border-gray-300 pt-4">
       <div>
        <p className="text-gray-600">{assessments?.data[0]?.userId?.name}</p>
         <div className="w-36 border-t border-black mx-auto pt-2 text-sm">Signature</div>
       </div>
       <div>
            <p className="text-gray-600">Rime Islam</p>
         <div className="w-36 border-t border-black mx-auto pt-2 text-sm">Seal</div>
       </div>
      </div>
    </div>
                ))
            }
        </div>
    );
};

export default Certificate;