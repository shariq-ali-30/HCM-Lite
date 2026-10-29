import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase/firebase";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, loading, setLoading } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      signOut(auth);
      setLoading(false)
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user && !loading) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="m-7 text-center">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-[#D6E5FF] bg-white px-4 py-2 text-sm font-semibold text-[#2379F6] transition-colors hover:bg-[#EFF6FF] active:bg-[#DBEAFE]"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <h1 className="mt-4 text-3xl font-bold text-[#2379F6]">AdminDashboard</h1>
    </div>
  );
};

export default AdminDashboard;
