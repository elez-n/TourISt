import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User } from "lucide-react";
import fb from "../assets/fb.png";
import gmail from "../assets/gmail.png";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logooo.png";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupSchema } from "@/lib/schemas/authSchema";
import { useRegisterMutation, useLoginMutation } from "@/store/api/userApi";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch } from "@/store/store";
import { setAccessToken } from "@/store/tokenStore";
import { setUser } from "@/store/slice/authSlice";
import type { JwtPayload } from "@/store/models/JwtPayload";

const Signup = () => {
  const navigate = useNavigate();
  const [registerApi] = useRegisterMutation();
  const [loginApi] = useLoginMutation();

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupSchema) => {
    try {
      await registerApi({
        username: data.username,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      }).unwrap();

      const response = await loginApi({
        username: data.username,
        password: data.password,
      }).unwrap();
      const { accessToken } = response;

      if (!accessToken) throw new Error("No access token returned");

      setAccessToken(accessToken);

      const decoded = jwtDecode<JwtPayload>(accessToken);

      dispatch(
        setUser({
          id: decoded.userId,
          username: decoded.username,
          role: decoded.role,
        })
      );

      navigate("/"); // ili ruta koju želiš nakon logina
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-400 to-indigo-600 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-2 animate-fadeInUp">
        <div className="hidden md:flex flex-col justify-center items-center bg-[#272757]! text-white p-10">
          <img src={logo} alt="Logo" className="w-70" />
          <p className="text-center text-indigo-100 max-w-xs mt-4">
            Napravite nalog i pronađite savršen turistički objekat za vas.
          </p>
        </div>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Kreirajte nalog
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              <Label className="text-xs text-gray-400">Ime</Label>
              <User className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
              <Input placeholder="Unesite ime" className="pl-10" {...register("firstName")} />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>

            <div className="relative">
              <Label className="text-xs text-gray-400">Prezime</Label>
              <User className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
              <Input placeholder="Unesite prezime" className="pl-10" {...register("lastName")} />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
            </div>

            <div className="relative">
              <Label className="text-xs text-gray-400">Email</Label>
              <Mail className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
              <Input type="email" placeholder="Unesite email" className="pl-10" {...register("email")} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="relative">
              <Label className="text-xs text-gray-400">Korisničko ime</Label>
              <User className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
              <Input placeholder="Unesite username" className="pl-10" {...register("username")} />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>

            <div className="relative">
              <Label className="text-xs text-gray-400">Lozinka</Label>
              <Lock className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
              <Input type="password" placeholder="Unesite lozinku" className="pl-10" {...register("password")} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="relative">
              <Label className="text-xs text-gray-400">Potvrdite lozinku</Label>
              <Lock className="absolute top-5.5 left-3 text-gray-400 h-5 w-5" />
              <Input type="password" placeholder="Ponovo unesite lozinku" className="pl-10" {...register("confirmPassword")} />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-[#5c5c99]! hover:bg-[#272757]! text-white font-semibold hover:scale-105 transition-transform" disabled={isSubmitting}>
              {isSubmitting ? "Registracija..." : "Registruj se"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-500 whitespace-nowrap">
                ili se registrujte pomoću
              </span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full flex items-center justify-center gap-3 hover:bg-gray-100">
                <img src={gmail} alt="Google" className="h-5 w-7" />
                Gmail
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-center gap-3 hover:bg-gray-100">
                <img src={fb} alt="Facebook" className="h-5 w-5" />
                Facebook
              </Button>
            </div>
          </div>

          <div className="text-center mt-6">
            <span className="text-gray-600">Već imate nalog?</span>{" "}
            <button className="text-indigo-600 font-medium hover:underline" onClick={() => navigate("/login")}>
              Prijavite se
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

export default Signup;
