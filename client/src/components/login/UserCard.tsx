import { useGetCurrentUserQuery, useLogoutMutation } from "@/store/api/userApi";
import { useSelector } from "react-redux";
import { logout, selectCurrentUser } from "@/store/slice/authSlice";
import { useAppDispatch } from "@/store/store";
import { setAccessToken } from "@/store/tokenStore";
import { User, Mail, Info, LogOut, Heart, BarChart3, FileText, Users } from "lucide-react";
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
  const isAdmin = user.role === "Admin";
  const isSluzbenik = user.role === "Officer";

  return (
    <div className="w-80 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 animate-fadeInUp transition-all duration-300">

      <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-xl">
          {initials}
        </div>
        <div>
          <p className="text-white font-semibold text-lg">
            {user.username ?? "Unknown"}
          </p>
          <p className="text-indigo-100 text-sm">
            {user.role ?? "No role"}
          </p>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 text-sm">
        <div className="flex items-center gap-3 text-gray-600">
          <User className="w-5 h-5 text-indigo-500" />
          <span>{`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "N/A"}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <Mail className="w-5 h-5 text-indigo-500" />
          <span>{user.email ?? "N/A"}</span>
        </div>

        {user.municipalityName && (
          <div className="flex items-center gap-3 text-gray-600">
            <Info className="w-5 h-5 text-indigo-500" />
            <span>{user.municipalityName}</span>
          </div>
        )}
      </div>

      {(isAdmin || isSluzbenik) && (
        <div className="px-5 pb-4">
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
              Administracija
            </p>

            <div className="flex flex-col gap-1">

              <button
                onClick={() => navigate("/stats")}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-50 transition text-gray-700"
              >
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Statistika
              </button>

              <button
                onClick={() => navigate("/reports")}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-50 transition text-gray-700"
              >
                <FileText className="w-5 h-5 text-indigo-600" />
                Izvještaji
              </button>

              {isAdmin && (
                <button
                  onClick={() => navigate("/users")}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-50 transition text-gray-700"
                >
                  <Users className="w-5 h-5 text-indigo-600" />
                  Korisnici
                </button>
              )}

            </div>
          </div>
        </div>
      )}

      <div className="px-5 pb-5 border-t border-gray-200 flex flex-col gap-2">

        <button
          onClick={() => navigate("/favorites")}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-gray-700 mt-5"
        >
          <Heart className="w-5 h-5 text-red-500" />
          Omiljeni objekti
        </button>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition"
        >
          <LogOut className="w-5 h-5" />
          {isLoggingOut ? "Odjava..." : "Odjavi se"}
        </button>
      </div>
    </div>
  );
};

export default UserCard;