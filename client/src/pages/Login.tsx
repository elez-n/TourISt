// src/pages/Login.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import fb from "../assets/fb.png"
import gmail from "../assets/gmail.png"
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logooo.png";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-indigo-600 px-4">

      {/* GLAVNI CONTAINER */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-2 animate-fadeInUp">

        {/* 🔷 LEFT BRAND / LOGO */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-blue-500 text-white p-10">
          <img src={logo} alt="Logo" className="w-70" />
          <p className="text-center text-indigo-100 max-w-xs">
            Tražite turističke objekte u Istočnom Sarajevu? Na pravom ste mjestu!
          </p>
        </div>

        {/* 🔶 RIGHT LOGIN FORM */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Dobrodošli nazad!
          </h2>

          <form className="space-y-4">
            <div className="relative">
              <Label htmlFor="email" className="text-xs text-gray-400">
                Korisničko ime
              </Label>
              <Mail className="absolute top-[22px] left-3 text-gray-400 h-5 w-5" />
              <Input
                id="email"
                type="email"
                placeholder="Unesite vaše korisničko ime"
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Label htmlFor="password" className="text-xs text-gray-400">
                Lozinka
              </Label>
              <Lock className="absolute top-[22px] left-3 text-gray-400 h-5 w-5" />
              <Input
                id="password"
                type="password"
                placeholder="Unesite lozinku"
                className="pl-10"
              />
            </div>

            <Button className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold hover:scale-105 transition-transform">
              Prijavi se
            </Button>
          </form>

          {/* SOCIAL */}
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



          {/* SIGN UP */}
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

      {/* ANIMACIJA */}
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
