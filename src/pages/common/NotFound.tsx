import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-8 text-center">
      {/* Error Code */}
      <h1 className="text-6xl md:text-8xl font-bold text-red-500 mb-4">404</h1>
      
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        Oops! Page Not Found
      </h2>
      
      {/* Description */}
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
        The page you're looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="px-8 py-3 bg-greenColor hover:bg-greenColor/80 text-white font-medium rounded-full transition duration-300 mb-6"
      >
        Go Back
      </button>
      
      {/* Home Link */}
      <p className="text-gray-500">
        Or return to{' '}
        <span 
          onClick={() => navigate('/')}
          className="text-greenColor hover:underline cursor-pointer "
        >
          homepage
        </span>
      </p>
    </div>
  );
};

export default NotFound;