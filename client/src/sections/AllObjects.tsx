import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetTouristObjectsQuery } from "../store/api/TouristObjectApi";
import { useNavigate } from "react-router-dom";

const ListaObjekata = () => {
  const { data, isLoading, isError } = useGetTouristObjectsQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="text-center py-20">Učitavanje...</div>;
  }

  if (isError || !data) {
    return (
      <div className="text-center py-20 text-red-500">
        Greška pri učitavanju objekata
      </div>
    );
  }

  return (
    <section className="w-full py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((o) => (
            <Card key={o.id} className="overflow-hidden">
              {o.photographs.length > 0 && (
                <img
                  src={`https://localhost:5001${o.photographs[0]}`}
                  alt={o.name}
                  className="h-48 w-full object-cover"
                />
              )}

              <CardContent className="pt-4">
                <CardTitle className="text-lg">{o.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {o.objectTypeName} • {o.municipalityName} •{" "}
                  {o.categoryName}
                </p>
              </CardContent>

              <CardFooter>
                <Button variant="outline" className="w-full"  onClick={() => navigate(`/objects/${o.id}`)}>
                  Detalji
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListaObjekata;
