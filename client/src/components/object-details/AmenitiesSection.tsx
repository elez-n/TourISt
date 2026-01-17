import { Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const amenities = [
  { name: "WiFi", available: true },
  { name: "Parking", available: true },
  { name: "Klima uređaj", available: true },
  { name: "Bazen", available: false },
  { name: "Spa centar", available: false },
];

const AmenitiesSection = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Dodatni sadržaji</h2>

      <Card>
        <CardContent className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {amenities.map((a) => (
            <div
              key={a.name}
              className={`flex items-center gap-2 ${
                a.available ? "" : "text-muted-foreground line-through"
              }`}
            >
              {a.available ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
              {a.name}
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};

export default AmenitiesSection;
