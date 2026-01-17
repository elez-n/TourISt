// src/components/Header.tsx
import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/logooo.png";
import userIcon from "../assets/user.svg";
import homeIcon from "../assets/house.svg";
import listIcon from "../assets/hotel.svg";
import mapIcon from "../assets/map-pinned.svg";
import contactIcon from "../assets/info.svg";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  const links = [
    { name: "Početna", path: "/", icon: homeIcon },
    { name: "Lista objekata", path: "/objects", icon: listIcon },
    { name: "Mapa", path: "#mapa", icon: mapIcon },
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
    <header className="fixed top-0 w-full h-20 z-50 bg-[#272757]">
      <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between">
        {/* Logo */}
        <img src={logo} alt="Logo" className="h-10 md:h-20" />

        {/* Desktop navigacija */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <span
              key={link.name}
              className="flex items-center gap-2 text-white cursor-pointer text-lg font-medium px-2 py-1 transition-all hover:text-yellow-300 hover:scale-110"
              onClick={() => handleNavigate(link.path)}
            >
              <img src={link.icon} alt={link.name} className="h-5 w-5" />
              {link.name}
            </span>
          ))}

          {/* USER IKONICA */}
          <div className="relative" ref={userRef}>
            <img
              src={userIcon}
              alt="User"
              className="h-9 w-9 cursor-pointer rounded-full hover:scale-110 transition"
              onClick={() => setUserOpen(!userOpen)}
            />
            {userOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg overflow-hidden">
                <div
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleNavigate("/login")}
                >
                  Prijavi se
                </div>
                <div
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleNavigate("/login")}
                >
                  Registruj se
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-indigo-700 flex flex-col items-center py-2 space-y-2">
          {links.map((link) => (
            <span
              key={link.name}
              className="flex items-center gap-2 text-white cursor-pointer text-lg font-medium w-full text-center py-2 hover:text-yellow-300"
              onClick={() => handleNavigate(link.path)}
            >
              <img src={link.icon} alt={link.name} className="h-5 w-5" />
              {link.name}
            </span>
          ))}

          {/* Mobile login/register */}
          <span
            className="text-white cursor-pointer text-lg py-2"
            onClick={() => handleNavigate("/login")}
          >
            Prijavi se / Registruj se
          </span>
        </div>
      )}
    </header>
  );
};

export default Header;
