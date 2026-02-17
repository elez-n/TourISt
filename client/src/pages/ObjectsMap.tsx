import Header from "../components/Header";
import MapSection, { type MapMarker } from "../sections/MapSection";
import Footer from "../components/Footer";
import Filters from "../components/all-objects/Filters";
import { Button } from "@/components/ui/button";

import {
  useGetTouristObjectsOfficerQuery,
  useGetTouristObjectsVisitorQuery,
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
import LoadingSpinner from "@/components/ui/loading";
import PagesHero from "@/sections/PagesHero";
import background from "../assets/mapa.jpg"

const ObjectsMap = () => {
  const dispatch = useAppDispatch();
  const objectParams = useAppSelector((state) => state.touristObject);
  const currentUser = useAppSelector((state) => state.auth.user);
  const isOfficer = currentUser?.role === "Officer";

  // Pozovi oba hooka, React vidi redoslijed, a mi kasnije biramo koji rezultat koristiti
  const officerQuery = useGetTouristObjectsOfficerQuery(objectParams, {skip: !isOfficer});
  const visitorQuery = useGetTouristObjectsVisitorQuery(objectParams, {skip: isOfficer});

  const { data, isLoading } = isOfficer ? officerQuery : visitorQuery;

  const {
    data: filters = { types: [], municipalities: [], categories: [] },
    isLoading: isFiltersLoading,
  } = useFetchFiltersQuery();

  if (isLoading || isFiltersLoading || !data) {
    return <LoadingSpinner />;
  }

  const { objects } = data;

  const markers: MapMarker[] =
    objects
      ?.filter((o) => o.coordinate1 !== 0 && o.coordinate2 !== 0)
      .map((o) => ({
        id: o.id,
        name: o.name,
        position: [o.coordinate1, o.coordinate2] as [number, number],
        thumbnailUrl: o.photographs?.[0]?.url,
        municipality: o.municipalityName,
        category: o.categoryName,
      })) ?? [];

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
      <PagesHero title="Mapa objekata" imageSrc={background} />

      <div className="flex-1 max-w-7xl mx-auto px-4 lg:px-8 py-6 w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-4">

            <div className="bg-white p-3 rounded-xl shadow-sm border flex items-center gap-2">
              <input
                type="text"
                value={objectParams.searchTerm || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Pretraži objekte..."
                className="w-full outline-none text-sm"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <MapSection markers={markers} />
            </div>
          </div>

          <div className="w-full lg:w-72 bg-white rounded-xl shadow-sm border p-4 space-y-4 h-fit sticky top-24">

            <h3 className="font-semibold text-gray-700 text-lg">
              Filteri
            </h3>

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
      </div>

      <Footer />
    </div>
  );
};

export default ObjectsMap;
