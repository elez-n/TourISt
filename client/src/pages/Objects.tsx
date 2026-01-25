import Header from "../components/Header";
import ObjectsHero from "../sections/ObjectsHero";
import AllObjects from "../sections/AllObjects";
import MapSection, { type MapMarker } from "../sections/MapSection";
import Footer from "../components/Footer";
import Filters from "../components/all-objects/Filters";
import { Button } from "@/components/ui/button";
import ObjectsPagination from "@/components/all-objects/ObjectsPagination";

import {
  useGetTouristObjectsQuery,
  useFetchFiltersQuery,
} from "@/store/api/TouristObjectApi";
import { useAppSelector, useAppDispatch } from "@/store/store";
import {
  setSearchTerm,
  resetParams,
  setPageNumber,
  setType,
  setMunicipality,
  setCategory,
} from "@/store/slice/objectSlice";

const Objects = () => {
  const dispatch = useAppDispatch();
  const objectParams = useAppSelector((state) => state.touristObject);

  const { data, isLoading } = useGetTouristObjectsQuery(objectParams);
  const {
    data: filters = { types: [], municipalities: [], categories: [] },
    isLoading: isFiltersLoading,
  } = useFetchFiltersQuery();

  if (isLoading || isFiltersLoading || !data) {
    return <div className="text-center py-20">Učitavanje...</div>;
  }

  const { objects, pagination } = data;

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <ObjectsHero />

      {/* GLAVNI SADRŽAJ */}
      <div className="flex-1 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-4 lg:px-8 py-6 w-full">
        
        {/* LIJEVA STRANA */}
        <div className="flex-1 flex flex-col">
          <input
            type="text"
            value={objectParams.searchTerm || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Pretraži objekte..."
            className="w-full p-2 border rounded shadow-sm mb-4"
          />

          <AllObjects objects={objects} />

          {/* PAGINACIJA – uvijek na dnu */}
          {pagination && (
            <div className="mt-auto pt-6 flex justify-center">
              <ObjectsPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(page) => dispatch(setPageNumber(page))}
              />
            </div>
          )}
        </div>

        {/* DESNA STRANA – FILTERI */}
        <div className="w-full lg:w-64 space-y-4">
          <Filters
            title="Tip objekta"
            typesList={filters.types}
            selected={
              objectParams.objectTypes
                ? objectParams.objectTypes.split(",")
                : []
            }
            onChange={(v) => {
              dispatch(setType(v.join(",")));
              dispatch(setPageNumber(1));
            }}
          />

          <Filters
            title="Opština"
            typesList={filters.municipalities}
            selected={
              objectParams.municipalities
                ? objectParams.municipalities.split(",")
                : []
            }
            onChange={(v) => {
              dispatch(setMunicipality(v.join(",")));
              dispatch(setPageNumber(1));
            }}
          />

          <Filters
            title="Kategorija"
            typesList={filters.categories}
            selected={
              objectParams.categories
                ? objectParams.categories.split(",")
                : []
            }
            onChange={(v) => {
              dispatch(setCategory(v.join(",")));
              dispatch(setPageNumber(1));
            }}
          />

          <Button
            variant="outline"
            className="w-full"
            onClick={handleResetFilters}
          >
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
