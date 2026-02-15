import Header from "../components/Header";
import AllObjects from "../sections/AllObjects";
import MapSection, { type MapMarker } from "../sections/MapSection";
import Footer from "../components/Footer";
import { useGetFavoritesQuery } from "@/store/api/favoritesApi";
import LoadingSpinner from "@/components/ui/loading";
import PagesHero from "@/sections/PagesHero";
import background1 from "../assets/background1.jpg";

const Favorites = () => {
  const { data: favoriteObjects = [], isLoading } = useGetFavoritesQuery();

  if (isLoading) return <LoadingSpinner />;

  const markers: MapMarker[] =
    favoriteObjects
      ?.filter((o) => o.coordinate1 !== 0 && o.coordinate2 !== 0)
      .map((o) => ({
        id: o.id,
        name: o.name,
        position: [o.coordinate1, o.coordinate2] as [number, number],
        thumbnailUrl: o.photographs?.[0]?.url,
        municipality: o.municipalityName,
        category: o.categoryName,
      })) ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <PagesHero title="Moji omiljeni objekti" imageSrc={background1} />

      <div className="flex-1 max-w-7xl mx-auto flex flex-col gap-6 px-4 lg:px-8 py-6 w-full">
        <AllObjects objects={favoriteObjects} />
      </div>

      <MapSection markers={markers} />
      <Footer />
    </div>
  );
};

export default Favorites;
