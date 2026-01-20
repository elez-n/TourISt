import { Card, CardContent } from "@/components/ui/card";
import { BedDouble, Home, Users } from "lucide-react";
import type { TouristObjectDto } from "../../store/types/TouristObject";

interface MainInfoSectionProps {
  object: TouristObjectDto;
}

const MainInfoSection = ({ object }: MainInfoSectionProps) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-semibold">Opis objekta</h2>
        <p className="text-muted-foreground leading-relaxed">{object.description}</p>
      </div>

      <Card className="h-fit">
        <CardContent className="p-6 space-y-4">
          <InfoRow icon={<Home />} label="Smještajne jedinice" value={object.numberOfUnits.toString()} />
          <InfoRow icon={<BedDouble />} label="Kreveta" value={object.numberOfBeds.toString()} />
          <InfoRow icon={<Users />} label="Osoba" value={(object.numberOfBeds).toString()} />
        </CardContent>
      </Card>
    </section>
  );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-muted-foreground">{icon}<span>{label}</span></div>
    <span className="font-semibold">{value}</span>
  </div>
);

export default MainInfoSection;
