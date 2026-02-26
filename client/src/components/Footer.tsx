
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#272757] text-gray-100 pt-12 pb-6 mt-30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-3">TourISt</h3>
          <p className="text-gray-300 text-sm">
            Centralna evidencija i promocija hotela, apartmana i drugih smještajnih kapaciteta u Istočnom Sarajevu. Otkrijte najbolje destinacije, objekte i dodatne usluge.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-3">Korisni linkovi</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              <a href="/objects" className="hover:text-white transition">Svi objekti</a>
            </li>
            <li>
              <a href="/about" className="hover:text-white transition">O nama</a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white transition">Kontakt</a>
            </li>
            <li>
              <a href="/faq" className="hover:text-white transition">FAQ</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-3">Kontakt</h3>
          <p className="text-gray-300 text-sm mb-1">Email: info@tourist.ba</p>
          <p className="text-gray-300 text-sm mb-1">Telefon: +387 57 123 456</p>
          <p className="text-gray-300 text-sm mb-3">Adresa: Istočno Sarajevo, BiH</p>

          <div className="flex gap-3">
            <a href="#" className="text-gray-300 hover:text-[#1877F2] transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-[#E1306C] transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-[#1DA1F2] transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-[#FF0000] transition">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-700 pt-4 text-center">
        <p className="text-gray-400 text-sm">
          © 2026 TourIS – Turistička ponuda Istočnog Sarajeva. Sva prava zadržana.
        </p>
      </div>
    </footer>
  );
};

export default Footer;