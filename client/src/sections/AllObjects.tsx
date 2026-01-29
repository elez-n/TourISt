import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { TouristObjectDto } from "../store/types/TouristObject";

interface AllObjectsProps {
  objects?: TouristObjectDto[]; 
}

const AllObjects: React.FC<AllObjectsProps> = ({ objects = [] }) => {
  const navigate = useNavigate();

  if (objects.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Nema objekata za prikaz
      </div>
    );
  }

  return (
    <section className="w-full py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {objects.map((o) => (
          <Card key={o.id} className="overflow-hidden">
            {o.photographs && o.photographs.length > 0 ? (
              <img
                src={`https://localhost:5001${o.photographs[0].url}`}
                alt={o.name}
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-400">
                Nema slike
              </div>
            )}

            <CardContent className="pt-4">
              <CardTitle className="text-lg">{o.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {o.objectTypeName} • {o.municipalityName} • {o.categoryName}
              </p>
            </CardContent>

            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/objects/${o.id}`)}
              >
                Detalji
              </Button>
            </CardFooter>
          </Card>
        ))} 
      </div>
    </section>
  );
};

export default AllObjects;
