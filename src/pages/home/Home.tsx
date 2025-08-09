import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-textColor w-full h-screen flex items-center justify-center text-6xl">
      <div className="flex items-center justify-center gap-8">
        <Link to="/user/dashboard">
          <button type="button" className="text-sm bg-gray-200 p-2 rounded">
            Student Dashboard
          </button>
        </Link>
        <Link to="/auth/register">
          <button type="button" className="text-sm bg-gray-200 p-2 rounded">
            Admin Dashboard
          </button>
        </Link>
        <Link to="/supervisor/dashboard">
          <button type="button" className="text-sm bg-gray-200 p-2 rounded">
            Supervisor Dashboard
          </button>
        </Link>

      </div>
    </div>
  );
};

export default Home;
