// src/components/Header.tsx
import React, { useState } from "react";
import logo from "../assets/logooo.png";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Početna", path: "/" },
    { name: "Lista objekata", path: "/objects" },
    { name: "Mapa", path: "#mapa" },
    { name: "Kontakt", path: "/kontakt" },
    { name: "Login", path: "/login" },
  ];

  const handleNavigate = (path: string) => {
    setOpen(false);
    if (path.startsWith("#")) {
      const el = document.getElementById(path.substring(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(path);
    }
  };

  return (
    <header className="fixed top-0 w-full h-20 z-50 bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between">
        {/* Logo */}
        <img src={logo} alt="Logo" className="h-10 md:h-20" />

        {/* Desktop navigacija */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <span
              key={link.name}
              className="text-white cursor-pointer text-lg font-medium px-2 py-1 transition-all hover:text-yellow-300 hover:scale-110"
              onClick={() => handleNavigate(link.path)}
            >
              {link.name}
            </span>
          ))}
        </nav>

        {/* Hamburger za mobilni */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-indigo-700 flex flex-col items-center py-2 space-y-2">
          {links.map((link) => (
            <span
              key={link.name}
              className="text-white cursor-pointer text-lg font-medium w-full text-center py-2 transition-all hover:text-yellow-300 hover:scale-105"
              onClick={() => handleNavigate(link.path)}
            >
              {link.name}
            </span>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
