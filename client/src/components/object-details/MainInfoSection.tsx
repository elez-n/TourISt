import { Card, CardContent } from "@/components/ui/card";
import { BedDouble, Home, Users } from "lucide-react";

const MainInfoSection = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* OPIS */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-semibold">Opis objekta</h2>
        <p className="text-muted-foreground leading-relaxed">
          Moderan hotel smješten u srcu planine, idealan za porodični
          odmor i zimske sportove...
        </p>
      </div>

      {/* INFO KARTICA */}
      <Card className="h-fit">
        <CardContent className="p-6 space-y-4">
          <InfoRow icon={<Home />} label="Smještajne jedinice" value="12" />
          <InfoRow icon={<BedDouble />} label="Kreveta" value="30" />
          <InfoRow icon={<Users />} label="Osoba" value="45" />
        </CardContent>
      </Card>
    </section>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span>{label}</span>
    </div>
    <span className="font-semibold">{value}</span>
  </div>
);

export default MainInfoSection;
