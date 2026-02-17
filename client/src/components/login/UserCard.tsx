import { useGetCurrentUserQuery, useLogoutMutation } from "@/store/api/userApi";
import { useSelector } from "react-redux";
import { logout, selectCurrentUser } from "@/store/slice/authSlice";
import { useAppDispatch } from "@/store/store";
import { setAccessToken } from "@/store/tokenStore";
import { User, Mail, Info, LogOut, Heart } from "lucide-react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

const UserCard: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id;

  const { data: user, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !userId,
  });

  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      setAccessToken(null);
      dispatch(logout());
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (isLoading) return <p className="p-4 text-gray-600">Loading user...</p>;
  if (!user) return <p className="p-4 text-gray-600">User not found.</p>;

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;

  return (
    <div className="w-72 bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 animate-fadeInUp hover:shadow-2xl transition-shadow duration-300">
      
      <div className="bg-[#5c5c99]! p-4 flex items-center gap-3 rounded-t-xl">
        <div className="w-12 h-12 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold text-lg">
          {initials}
        </div>
        <div>
          <p className="text-white font-bold text-lg">{user.username ?? "Unknown"}</p>
          <p className="text-indigo-200 text-sm">{user.role ?? "No role"}</p>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-5 h-5 text-indigo-500" />
          <span>{`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="w-5 h-5 text-indigo-500" />
          <span>{user.email ?? "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Info className="w-5 h-5 text-indigo-500" />
          <span>Role: {user.role ?? "N/A"}</span>
        </div>
        {user.position && (
          <div className="flex items-center gap-2 text-gray-600">
            <Info className="w-5 h-5 text-indigo-500" />
            <span>Position: {user.position}</span>
          </div>
        )}
        {user.municipalityName && (
          <div className="flex items-center gap-2 text-gray-600">
            <Info className="w-5 h-5 text-indigo-500" />
            <span>Municipality: {user.municipalityName}</span>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 flex flex-col gap-2">

        <button
          onClick={() => navigate("/favorites")}
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition text-gray-700"
        >
          <Heart className="w-5 h-5 text-red-500" />
          Omiljeni objekti
        </button>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-50 text-red-600 transition"
        >
          <LogOut className="w-5 h-5" />
          {isLoggingOut ? "Odjava..." : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
