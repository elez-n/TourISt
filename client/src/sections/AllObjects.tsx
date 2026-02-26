import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TouristObjectDto } from "../store/types/TouristObject";
import {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "@/store/api/favoritesApi";
import { useMemo } from "react";
import { useAppSelector } from "@/store/store";

interface AllObjectsProps {
  objects?: TouristObjectDto[];
}

const AllObjects: React.FC<AllObjectsProps> = ({ objects = [] }) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const { data: favorites = [] } = useGetFavoritesQuery(undefined, {
    skip: !user,
  });
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const favoriteIds = useMemo(() => new Set(favorites.map(f => f.id)), [favorites]);

  const toggleFavorite = async (objectId: number) => {
    if (!user) return;
    if (favoriteIds.has(objectId)) {
      await removeFavorite(objectId);
    } else {
      await addFavorite(objectId);
    }
  };

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
          <Card key={o.id} className="overflow-hidden pt-0 relative">
            {o.photographs && o.photographs.length > 0 ? (
              <img
                src={`https://localhost:5001${o.photographs[0].url}`}
                alt={o.name}
                className="h-48 w-full object-cover mt-0"
              />
            ) : (
              <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-400">
                Nema slike
              </div>
            )}

            {user && (
              <button
                onClick={() => toggleFavorite(o.id)}
                className={`absolute top-2 right-2 z-10 p-1 rounded-full transition-colors duration-200 ${
                  favoriteIds.has(o.id) ? "text-red-500" : "text-gray-400"
                }`}
              >
                <Heart size={24} />
              </button>
            )}

            <CardContent>
              <CardTitle className="text-lg">{o.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {o.objectTypeName} • {o.municipalityName} • {o.categoryName || "Nema kategorije"}
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
