import { useSetPasswordMutation } from "@/store/api/adminApi";
import { useLoginMutation } from "@/store/api/userApi";

import { setAccessToken } from "@/store/tokenStore";
import { setUser, logout } from "@/store/slice/authSlice";
import type { JwtPayload } from "@/store/models/JwtPayload";

import { useAppDispatch } from "@/store/store";
import { jwtDecode } from "jwt-decode";

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Lock, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logooo.png";

const SetPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";
  const username = searchParams.get("username") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [setPasswordApi, { isLoading }] = useSetPasswordMutation();
  const [login] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) return setError("Token nedostaje.");
    if (!username) return setError("Username nedostaje.");
    if (password !== confirmPassword)
      return setError("Lozinke se ne podudaraju.");

    try {
      await setPasswordApi({
        token,
        data: { newPassword: password },
      }).unwrap();

      const response = await login({ username, password }).unwrap();
      const { accessToken } = response;

      if (!accessToken) {
        throw new Error("No access token returned");
      }

      setAccessToken(accessToken);

      const decoded = jwtDecode<JwtPayload>(accessToken);

      dispatch(
        setUser({
          id: decoded.userId,
          username: decoded.username,
          role: decoded.role,
        })
      );

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Set password / login error:", err);
      setError("Greška prilikom postavljanja lozinke.");
      dispatch(logout());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-400 to-indigo-600 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-2 animate-fadeInUp">
        
        <div className="hidden md:flex flex-col justify-center items-center bg-[#272757] text-white p-10">
          <img src={logo} alt="Logo" className="w-64" />
          <p className="text-center text-indigo-100 max-w-xs mt-4">
            Postavite sigurnu lozinku i automatski ćete biti prijavljeni.
          </p>
        </div>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Postavite lozinku
          </h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            <div className="relative">
              <Label className="text-xs text-gray-400">Nova lozinka</Label>
              <Lock className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
              <Input
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10"
                placeholder="Unesite novu lozinku"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="absolute right-3 top-6 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <div className="relative">
              <Label className="text-xs text-gray-400">
                Potvrdite lozinku
              </Label>
              <Lock className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                className="pl-10 pr-10"
                placeholder="Ponovo unesite lozinku"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <div
                className="absolute right-3 top-6 cursor-pointer text-gray-400"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5C5C99]! hover:bg-[#272757]! text-white font-semibold hover:scale-105 transition-transform"
            >
              {isLoading ? "Postavljanje..." : "Postavi lozinku"}
            </Button>
          </form>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default SetPasswordPage;
