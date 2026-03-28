import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


export default function Navbar() {
 const { user, setUser } = useAuth();
const navigate = useNavigate();

return (
    <div className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 h-16 text-white font-medium">

        {/* Logo */}
        <div
          className="text-xl font-bold cursor-pointer hover:scale-105 transition-transform flex items-center gap-2 group"
          onClick={() => navigate("/")}
        >
          <span className="text-2xl group-hover:rotate-12 transition-transform">🎟️</span>
          <span className="bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
            CityPulse
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 text-sm">
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer text-gray-400 hover:text-white transition-colors relative group"
          >
            Events
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
          </span>

          {user ? (
            <div className="flex items-center gap-4">
              <span
                onClick={() => navigate("/tickets")}
                className="cursor-pointer text-gray-400 hover:text-white transition-colors"
              >
                My Tickets
              </span>

              <button
                onClick={() => {
                  setUser(null);
                  navigate("/login");
                }}
                className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 text-red-400 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-1.5 rounded-full text-gray-300 hover:text-white transition-colors"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20 transition-all font-semibold"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}