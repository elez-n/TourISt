import Header from "../components/Header";
import ObjectsHero from "../sections/ObjectsHero";
import AllObjects from "../sections/AllObjects";
import MapSection, { type MapMarker } from "../sections/MapSection";
import Footer from "../components/Footer";
import Filters from "../components/all-objects/Filters";
import { Button } from "@/components/ui/button";

import { useGetTouristObjectsQuery, useFetchFiltersQuery } from "@/store/api/TouristObjectApi";
import { useAppSelector, useAppDispatch } from "@/store/store";
import {
  setSearchTerm,
  resetParams,
  setPageNumber,
  setType,
  setMunicipality,
  setCategory
} from "@/store/slice/objectSlice";

const Objects = () => {
  const dispatch = useAppDispatch();
  const objectParams = useAppSelector((state) => state.touristObject);

  // Dobavljanje objekata i filtera
  const { data: objects, isLoading } = useGetTouristObjectsQuery(objectParams);
  const { data: filters, isLoading: isFiltersLoading } = useFetchFiltersQuery();

  if (isLoading || !objects || isFiltersLoading)
    return <div className="text-center py-20">Učitavanje...</div>;

  const markers: MapMarker[] = objects
    .filter((o) => o.coordinate1 !== 0 && o.coordinate2 !== 0)
    .map((o) => ({
      id: o.id,
      name: o.name,
      position: [o.coordinate1, o.coordinate2],
    }));

  const handleSearchChange = (value: string) => {
    dispatch(setSearchTerm(value));
    dispatch(setPageNumber(1));
  };

  const handleResetFilters = () => {
    dispatch(resetParams());
    dispatch(setPageNumber(1));
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <Header />
      <ObjectsHero />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-4 lg:px-8 py-6">
        {/* Lijeva strana */}
        <div className="flex-1 space-y-4">
          <input
            type="text"
            value={objectParams.searchTerm || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Pretraži objekte..."
            className="w-full p-2 border rounded shadow-sm"
          />

          <AllObjects objects={objects} />
        </div>

        {/* Desna strana */}
        <div className="w-full lg:w-64 space-y-4">
          <Filters
            title="Tip objekta"
            typesList={filters?.types || []}
            selected={objectParams.objectTypes ? objectParams.objectTypes.split(",") : []}
            onChange={(newTypes) => dispatch(setType(newTypes.join(",")))}
          />
          <Filters
            title="Opština"
            typesList={filters?.municipalities || []}
            selected={objectParams.municipalities ? objectParams.municipalities.split(",") : []}
            onChange={(newMuni) => dispatch(setMunicipality(newMuni.join(",")))}
          />
          <Filters
            title="Kategorija"
            typesList={filters?.categories || []}
            selected={objectParams.categories ? objectParams.categories.split(",") : []}
            onChange={(newCat) => dispatch(setCategory(newCat.join(",")))}
          />

          <Button variant="outline" className="w-full" onClick={handleResetFilters}>
            Resetuj filtere
          </Button>
        </div>
      </div>

      <MapSection title="Mapa svih objekata" markers={markers} />
      <Footer />
    </div>
  );
};

export default Objects;
