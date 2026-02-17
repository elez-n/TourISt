import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import fb from "../assets/fb.png";
import gmail from "../assets/gmail.png";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logooo.png";

import { useAppDispatch } from "@/store/store";
import { setAccessToken } from "@/store/tokenStore";
import { setUser, logout } from "@/store/slice/authSlice";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/store/models/JwtPayload";

import { useLoginMutation } from "@/store/api/userApi";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login({ username, password }).unwrap();
      const { accessToken } = response;

      if (!accessToken) {
        throw new Error("No access token returned");
      }

      setAccessToken(accessToken);

      const decoded = jwtDecode<JwtPayload>(accessToken);
      console.log("Decoded JWT:", decoded);

      dispatch(
        setUser({
          id: decoded.userId,
          username: decoded.username,
          role: decoded.role,
        })
      );

      window.location.href = "/";
    } catch (err) {
      console.error("Login error:", err);
      setError("Neispravni podaci za prijavu.");
      dispatch(logout());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-400 to-indigo-600 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-2 animate-fadeInUp">
        <div className="hidden md:flex flex-col justify-center items-center bg-[#272757]! text-white p-10">
          <img src={logo} alt="Logo" className="w-70" />
          <p className="text-center text-indigo-100 max-w-xs">
            Tražite turističke objekte u Istočnom Sarajevu? Na pravom ste mjestu!
          </p>
        </div>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Dobrodošli nazad!
          </h2>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="relative">
              <Label htmlFor="username" className="text-xs text-gray-400">
                Korisničko ime
              </Label>
              <Mail className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
              <Input
                id="username"
                type="text"
                placeholder="Unesite vaše korisničko ime"
                className="pl-10"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Label htmlFor="password" className="text-xs text-gray-400">
                Lozinka
              </Label>
              <Lock className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
              <Input
                id="password"
                type="password"
                placeholder="Unesite lozinku"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#5C5C99]! hover:bg-[#272757]! text-white font-semibold hover:scale-105 transition-transform"
            >
              {isLoading ? "Prijava..." : "Prijavi se"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-500 whitespace-nowrap">
                ili se prijavite pomoću
              </span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 hover:bg-gray-100"
              >
                <img src={gmail} alt="Google" className="h-5 w-7" />
                Gmail
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 hover:bg-gray-100"
              >
                <img src={fb} alt="Facebook" className="h-5 w-5" />
                Facebook
              </Button>
            </div>
          </div>

          <div className="text-center mt-6">
            <span className="text-gray-600">Nemate nalog?</span>{" "}
            <button
              className="text-indigo-600 font-medium hover:underline"
              onClick={() => navigate("/signup")}
            >
              Registrujte se
            </button>
          </div>
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

export default Login;
