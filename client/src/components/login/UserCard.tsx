import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/store";
import { logout as logoutSlice } from "@/store/slice/authSlice";
import { setAccessToken } from "@/store/tokenStore";
import { userApi } from "@/store/api/userApi";
import { User, Mail, KeyRound, Info, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserCardProps {
    user: {
        id: string;
        username: string;
        role: string;
    };
}

const UserCard: FC<UserCardProps> = ({ user }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await userApi.logout();
            setAccessToken(null);
            dispatch(logoutSlice());
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <div className="w-72 bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 animate-fadeInUp">
            <div className="bg-indigo-600 p-4 flex items-center gap-3">
                <User className="text-white w-10 h-10" />
                <div>
                    <p className="text-white font-bold text-lg">{user.username}</p>
                    <p className="text-indigo-200 text-sm">{user.role}</p>
                </div>
            </div>

            <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-5 h-5 text-indigo-500" />
                    <span>{user.username}@example.com</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <KeyRound className="w-5 h-5 text-indigo-500" />
                    <span>ID: {user.id}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Info className="w-5 h-5 text-indigo-500" />
                    <span>Role: {user.role}</span>
                </div>
            </div>

            <div className="p-4 border-t border-gray-200">
                <Button
                    variant="default"
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5" /> Logout
                </Button>
            </div>

            <style>
                {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.5s ease-out forwards;
          }
        `}
            </style>
        </div>
    );
};

export default UserCard;
