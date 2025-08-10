import { Link, useNavigate } from "react-router-dom";
import { useCurrentRole, useCurrentToken } from "../../redux/features/auth/authSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Home = () => {
   const navigate = useNavigate();
  const token = useSelector(useCurrentToken);
  const role = useSelector(useCurrentRole);

   useEffect(() => {
    if (!token) {
      navigate("/auth/login");
    }
  }, [token, navigate]);
  
  return (
    <div className="text-textColor w-full h-screen flex items-center justify-center text-6xl">
      <div className="flex items-center justify-center gap-8">
        <Link to={`/${role}/dashboard`}>
          <button type="button" className="text-sm bg-gray-200 p-2 rounded">
            {role} Dashboard
          </button>
        </Link>

      </div>
    </div>
  );
};

export default Home;
