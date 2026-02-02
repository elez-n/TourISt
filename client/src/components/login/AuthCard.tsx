
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="w-85 rounded-xl shadow-lg border border-gray-200 animate-fadeInUp">
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <CardTitle className="text-lg font-bold text-gray-800">
          Dobrodošli!
        </CardTitle>
        <p className="text-gray-500 text-sm">
          Prijavite se ili registrujte nalog da biste pristupili svim funkcijama.
        </p>
      </CardContent>

      <CardFooter className="flex gap-3 px-6 py-4">
        <Button
          variant="default"
          className="flex-1 flex items-center justify-center gap-2 bg-[#5C5C99]! hover:bg-[#272757]! text-white"
          onClick={() => navigate("/login")}
        >
          <LogIn size={18} /> Prijavi se
        </Button>
        <Button
          variant="default"
          className="flex-1 flex items-center justify-center gap-2 bg-[#5C5C99]! hover:bg-[#272757]! text-white"
          onClick={() => navigate("/signup")}
        >
          <UserPlus size={18} /> Registruj se
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
