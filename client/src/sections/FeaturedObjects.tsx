"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loading";
import { useFetchFeaturedObjectsQuery } from "@/store/api/TouristObjectApi";
import { useNavigate } from "react-router-dom";

const FeaturedObjects = () => {
  const { data: objects = [], isLoading, isError } = useFetchFeaturedObjectsQuery();
  const navigate = useNavigate();

  if (isLoading) return <LoadingSpinner />
  if (isError) return <p className="text-center py-16 text-red-500">Greška pri učitavanju.</p>;
  if (!objects.length) return <p className="text-center py-16">Nema izdvojenih objekata.</p>;

  return (
    <section className="w-full py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-8">Izdvojeni objekti</h2>

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
      </div>
    </section>
  );
};

export default FeaturedObjects;
