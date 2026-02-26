
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import grad1 from "../assets/grad1.jpg";
import grad2 from "../assets/grad2.jpg";
import grad3 from "../assets/grad3.jpg";
import { useNavigate } from "react-router-dom";

const images = [grad1, grad2, grad3];

const HeroImageSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-62.5 md:h-100 rounded-2xl overflow-hidden">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt="Grad"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full py-16 md:py-24 bg-gray-100 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left space-y-6">
          <h1 className="text-3xl md:text-5xl font-extrabold opacity-0 animate-fadeInUp">
            Otkrijte turističke objekte Istočnog Sarajeva
          </h1>
          <p className="text-gray-600 text-base md:text-lg opacity-0 animate-fadeInUp delay-200">
            Centralna evidencija i promocija hotela, apartmana i drugih
            smještajnih kapaciteta.
          </p>
          <Button className="bg-[#5C5C99]! hover:bg-[#272757]! text-white rounded-xl shadow-lg opacity-0 animate-fadeInUp delay-400"
          onClick={() => navigate("/objects")}>
            Pogledaj objekte
          </Button>
        </div>
        <HeroImageSlider />
      </div>
      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInUp { animation: fadeInUp 1s forwards; }
          .animate-fadeInUp.delay-200 { animation-delay: 0.2s; }
          .animate-fadeInUp.delay-400 { animation-delay: 0.4s; }
        `}
      </style>
    </section>
  );
};

export default Hero;
