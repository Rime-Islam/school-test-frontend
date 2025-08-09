import CreateQuestionForm from "../../../components/question/CreateQuestionForm";


const CreateQuestion = () => {
    return (
        <div className="container mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-xl font-semibold">Create Question</h1>
        <p className="text-gray-500">Fill out the fields below to create a new question.</p>
      </header>
      <CreateQuestionForm />
    </div>
    );
};

export default CreateQuestion;