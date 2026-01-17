import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

const ObjectHeader = () => {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-3xl md:text-4xl font-bold">
          Hotel Zlatni Bor
        </h1>

        <Badge variant="secondary">Featured</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
        <span>Hotel</span>
        <span>•</span>
        <span>4 ★</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          Jahorina, Republika Srpska
        </span>
      </div>
    </section>
  );
};

export default ObjectHeader;
