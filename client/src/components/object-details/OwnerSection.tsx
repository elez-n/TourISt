import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail } from "lucide-react";

interface OwnerSectionProps {
  owner: string;
  contactPhone: string;
  email: string;
}

const OwnerSection = ({ owner, contactPhone, email }: OwnerSectionProps) => {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Vlasnik objekta</h2>

      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

          <div className="space-y-2">
            <p className="flex items-center gap-2 text-gray-700 font-medium">
              <User className="w-5 h-5 text-gray-500" />
              {owner}
            </p>

            <p className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" />
              {contactPhone}
            </p>

            <p className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4 text-gray-400" />
              {email}
            </p>
          </div>

          <Button
            asChild
            className="bg-[#5C5C99] hover:bg-[#272757] text-white! px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Upit za objekat ${owner}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Kontaktiraj vlasnika
            </a>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default OwnerSection;