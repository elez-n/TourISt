import { useState, useRef, useEffect } from "react";
import logo from "../assets/logooo.png";
import userIcon from "../assets/user.svg";
import homeIcon from "../assets/house.svg";
import listIcon from "../assets/hotel.svg";
import mapIcon from "../assets/map-pinned.svg";
import contactIcon from "../assets/info.svg";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAppSelector } from "@/store/store";
import AuthCard from "@/components/login/AuthCard";
import UserCard from "@/components/login/UserCard";

const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const links = [
    { name: "Početna", path: "/", icon: homeIcon },
    { name: "Lista objekata", path: "/objects", icon: listIcon },
    { name: "Mapa", path: "/map", icon: mapIcon },
    { name: "Kontakt", path: "/kontakt", icon: contactIcon },
  ];

  const handleNavigate = (path: string) => {
    setOpen(false);
    setUserOpen(false);

    if (path.startsWith("#")) {
      const el = document.getElementById(path.substring(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 w-full h-20 z-50 bg-[#272757]/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between">
        <img
          src={logo}
          alt="Logo"
          className="h-10 md:h-20 cursor-pointer hover:scale-105 transition"
          onClick={() => navigate("/")}
        />

        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <span
              key={link.name}
              className="relative flex items-center gap-2 text-white cursor-pointer text-lg font-medium px-2 py-1 transition-all hover:scale-105 group"
              onClick={() => handleNavigate(link.path)}
            >
              <img src={link.icon} alt={link.name} className="h-5 w-5" />
              {link.name}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
            </span>
          ))}

          <div className="relative" ref={userRef}>
            <img
              src={userIcon}
              alt="User"
              className="h-9 w-9 cursor-pointer rounded-full border-2 border-white hover:border-yellow-400 hover:shadow-lg transition"
              onClick={() => setUserOpen(!userOpen)}
            />
            {userOpen && (
              <div className="absolute right-0 mt-2 z-50">
                {isAuthenticated && user ? <UserCard /> : <AuthCard />}
              </div>
            )}
          </div>
        </nav>

        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#272757]! flex flex-col items-center py-4 space-y-3 animate-slideDown">
          {links.map((link) => (
            <span
              key={link.name}
              className="flex items-center gap-2 text-white cursor-pointer text-lg font-medium w-full text-center py-2 hover:text-yellow-300 transition"
              onClick={() => handleNavigate(link.path)}
            >
              <img src={link.icon} alt={link.name} className="h-5 w-5" />
              {link.name}
            </span>
          ))}

          <div className="w-full flex justify-center">
            {isAuthenticated && user ? (
              <UserCard />
            ) : (
              <AuthCard />
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
