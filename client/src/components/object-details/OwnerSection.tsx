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
      <h2 className="text-xl font-semibold">Vlasnik objekta</h2>
      <Card>
        <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              {owner}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground text-sm">
              <Phone className="w-4 h-4" />
              {contactPhone}
            </p>

            <p className="flex items-center gap-2 text-muted-foreground text-sm">
              <Mail className="w-4 h-4" />
              {email}
            </p>
          </div>
          <Button>Kontaktiraj vlasnika</Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default OwnerSection;
