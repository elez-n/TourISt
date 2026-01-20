import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface AmenitiesSectionProps {
  additionalServices?: string[];
}

const AmenitiesSection = ({ additionalServices = [] }: AmenitiesSectionProps) => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Dodatni sadržaji</h2>
      <Card>
        <CardContent className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {additionalServices.length === 0 && <p className="text-muted-foreground">Nema dodatnih sadržaja</p>}
          {additionalServices.map((a) => (
            <div key={a} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              {a}
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};

export default AmenitiesSection;
