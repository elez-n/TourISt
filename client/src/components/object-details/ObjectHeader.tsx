import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import type { TouristObjectDto } from "../../store/types/TouristObject";

interface ObjectHeaderProps {
  object: TouristObjectDto;
}

const ObjectHeader = ({ object }: ObjectHeaderProps) => {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-3xl md:text-4xl font-bold">{object.name}</h1>
        {object.featured && <Badge variant="secondary">Featured</Badge>}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
        <span>{object.objectTypeName}</span>
        <span>•</span>
        <span>{object.categoryName}</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {object.municipalityName}
        </span>
      </div>
    </section>
  );
};

export default ObjectHeader;
