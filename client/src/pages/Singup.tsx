import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User } from "lucide-react";
import fb from "../assets/fb.png";
import gmail from "../assets/gmail.png";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logooo.png";

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-indigo-600 px-4">

      {/* GLAVNI CONTAINER */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-2 animate-fadeInUp">

        {/* 🔷 LEFT BRAND / LOGO */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-blue-500 text-white p-10">
          <img src={logo} alt="Logo" className="w-70" />
          <p className="text-center text-indigo-100 max-w-xs mt-4">
            Napravite nalog i pronađite savršen turistički objekat za vas.
          </p>
        </div>

        {/* 🔶 RIGHT SIGN UP FORM */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Kreirajte nalog
          </h2>

          <form className="space-y-4">
            {/* Ime */}
            <div className="relative">
              <Label className="text-xs text-gray-400">Ime i prezime</Label>
              <User className="absolute top-[22px] left-3 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Unesite ime i prezime"
                className="pl-10"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Label className="text-xs text-gray-400">Email</Label>
              <Mail className="absolute top-[22px] left-3 text-gray-400 h-5 w-5" />
              <Input
                type="email"
                placeholder="Unesite email adresu"
                className="pl-10"
              />
            </div>

            {/* Lozinka */}
            <div className="relative">
              <Label className="text-xs text-gray-400">Lozinka</Label>
              <Lock className="absolute top-[22px] left-3 text-gray-400 h-5 w-5" />
              <Input
                type="password"
                placeholder="Unesite lozinku"
                className="pl-10"
              />
            </div>

            {/* Potvrda lozinke */}
            <div className="relative">
              <Label className="text-xs text-gray-400">Potvrdite lozinku</Label>
              <Lock className="absolute top-[22px] left-3 text-gray-400 h-5 w-5" />
              <Input
                type="password"
                placeholder="Ponovo unesite lozinku"
                className="pl-10"
              />
            </div>

            <Button className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold hover:scale-105 transition-transform">
              Registruj se
            </Button>
          </form>

          {/* SOCIAL SIGN UP */}
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-500 whitespace-nowrap">
                ili se registrujte pomoću
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

          {/* LOGIN LINK */}
          <div className="text-center mt-6">
            <span className="text-gray-600">Već imate nalog?</span>{" "}
            <button
              className="text-indigo-600 font-medium hover:underline"
              onClick={() => navigate("/login")}
            >
              Prijavite se
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

export default Signup;
