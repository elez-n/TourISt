import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PagesHero from "../sections/PagesHero";
import background from "../assets/background.jpg"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    // primjer validacije
    if (!name || !email || !subject || !message) {
      setError("Molimo popunite sva polja.");
      return;
    }

    try {
      setSuccess("Poruka je uspješno poslana!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setError("Došlo je do greške prilikom slanja poruke.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <PagesHero title="Kontakt" imageSrc={background} />

      <div className="flex-1 max-w-7xl mx-auto px-4 lg:px-8 py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Javite nam se
            </h2>
            <p className="text-gray-600">
              Imate pitanje ili prijedlog? Pošaljite nam poruku i odgovorit ćemo u najkraćem mogućem roku.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#5c5c99]" />
                <span className="text-gray-700">kontakt@firma.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#5c5c99]" />
                <span className="text-gray-700">+387 61 123 456</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#5c5c99]" />
                <span className="text-gray-700">Sarajevo, Bosna i Hercegovina</span>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-xl shadow-md p-8">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label className="text-gray-600 text-sm">Ime i prezime</Label>
                <Input
                  placeholder="Vaše ime"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="text-gray-600 text-sm">Email</Label>
                <Input
                  type="email"
                  placeholder="Vaš email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="text-gray-600 text-sm">Naslov poruke</Label>
                <Input
                  placeholder="Naslov"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="text-gray-600 text-sm">Poruka</Label>
                <textarea
                  placeholder="Vaša poruka"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#5c5c99]"
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-[#5c5c99]! hover:bg-[#272757]! text-white font-semibold">
                Pošalji poruku
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;