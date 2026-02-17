import Header from "../components/Header";
import AllObjects from "../sections/AllObjects";
import MapSection, { type MapMarker } from "../sections/MapSection";
import Footer from "../components/Footer";
import Filters from "../components/all-objects/Filters";
import { Button } from "@/components/ui/button";
import ObjectsPagination from "@/components/all-objects/ObjectsPagination";

import {
  useFetchFiltersQuery,
  useGetTouristObjectsOfficerQuery,
  useGetTouristObjectsVisitorQuery,
} from "@/store/api/TouristObjectApi";
import { useAppSelector, useAppDispatch } from "@/store/store";
import {
  setSearchTerm,
  resetParams,
  setPageNumber,
  setType,
  setMunicipality,
  setCategory,
  setAdditionalServices,
} from "@/store/slice/objectSlice";
import LoadingSpinner from "@/components/ui/loading";
import background1 from "../assets/background1.jpg";
import PagesHero from "@/sections/PagesHero";

const Objects = () => {
  const dispatch = useAppDispatch();
  const objectParams = useAppSelector((state) => state.touristObject);
  const currentUser = useAppSelector((state) => state.auth.user);
  const isOfficer = currentUser?.role === "Officer";

  const officerQuery = useGetTouristObjectsOfficerQuery(objectParams, {skip: !isOfficer });
  const visitorQuery = useGetTouristObjectsVisitorQuery(objectParams, {skip: isOfficer});

  const { data, isLoading } = isOfficer ? officerQuery : visitorQuery;

  const {
    data: filters = { types: [], municipalities: [], categories: [], additionalServices: [] },
    isLoading: isFiltersLoading,
  } = useFetchFiltersQuery();

  if (isLoading || isFiltersLoading || !data) {
    return <LoadingSpinner />;
  }

  const { objects, pagination } = data;

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
      <PagesHero title="Turistički objekti" imageSrc={background1} />

      <div className="flex-1 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-4 lg:px-8 py-6 w-full">
        <div className="flex-1 flex flex-col">
          <div className="flex gap-4 mb-4 flex-wrap">
            <input
              type="text"
              value={objectParams.searchTerm || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Pretraži objekte..."
              className="flex-1 p-2 border rounded shadow-sm"
            />

            <Button
              style={{ backgroundColor: "#5C5C99", color: "white" }}
              onClick={() => { window.location.href = "/add-object"; }}
            >
              Dodaj novi objekat
            </Button>
          </div>

          <AllObjects objects={objects} />

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

        <div className="w-full lg:w-64 space-y-4">
          <Filters
            title="Tip objekta"
            typesList={filters.types}
            selected={objectParams.objectTypes ? objectParams.objectTypes.split(",") : []}
            onChange={(v) => { dispatch(setType(v.join(","))); dispatch(setPageNumber(1)); }}
          />
          <Filters
            title="Opština"
            typesList={filters.municipalities}
            selected={objectParams.municipalities ? objectParams.municipalities.split(",") : []}
            onChange={(v) => { dispatch(setMunicipality(v.join(","))); dispatch(setPageNumber(1)); }}
          />
          <Filters
            title="Kategorija"
            typesList={filters.categories}
            selected={objectParams.categories ? objectParams.categories.split(",") : []}
            onChange={(v) => { dispatch(setCategory(v.join(","))); dispatch(setPageNumber(1)); }}
          />
          <Filters
            title="Dodatne usluge"
            typesList={filters.additionalServices}
            selected={objectParams.additionalServices ? objectParams.additionalServices.split(",") : []}
            onChange={(v) => { dispatch(setAdditionalServices(v.join(","))); dispatch(setPageNumber(1)); }}
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

      <MapSection markers={markers} />
      <Footer />
    </div>
  );
};

export default Objects;
