import Header from "../components/Header";
import AllObjects from "../sections/AllObjects";
import MapSection, { type MapMarker } from "../sections/MapSection";
import Footer from "../components/Footer";
import Filters from "../components/all-objects/Filters";
import { Button } from "@/components/ui/button";
import ObjectsPagination from "@/components/all-objects/ObjectsPagination";

import {
  useFetchFiltersQuery,
  useFetchMunicipalitiesQuery,
  useFetchObjectTypesQuery,
  useGetTouristObjectsOfficerQuery,
  useGetTouristObjectsVisitorQuery,
} from "@/store/api/touristObjectApi";

import { useCreateRequestMutation } from "@/store/api/registrationRequestsApi";

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
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Modal } from "@/components/object-details/Modal";
import { toast } from "sonner";

const Objects = () => {
  const dispatch = useAppDispatch();
  const objectParams = useAppSelector((state) => state.touristObject);
  const currentUser = useAppSelector((state) => state.auth.user);
  const isOfficer = currentUser?.role === "Officer";

  const officerQuery = useGetTouristObjectsOfficerQuery(objectParams, { skip: !isOfficer });
  const visitorQuery = useGetTouristObjectsVisitorQuery(objectParams, { skip: isOfficer });

  const { data, isLoading } = isOfficer ? officerQuery : visitorQuery;

  const navigate = useNavigate();

  const {
    data: filters = { types: [], municipalities: [], categories: [], additionalServices: [] },
    isLoading: isFiltersLoading,
  } = useFetchFiltersQuery();

  const { data: types1 = [] } = useFetchObjectTypesQuery();
  const { data: municipalities1 = [] } = useFetchMunicipalitiesQuery();

  const [createRequest] = useCreateRequestMutation();

  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const [formData, setFormData] = useState({
    ownerFirstName: "",
    ownerLastName: "",
    ownerPhone: "",
    ownerEmail: "",
    objectName: "",
    address: "",
    objectTypeId: 0,
    municipalityId: 0,
  });

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createRequest({
        ownerFirstName: formData.ownerFirstName,
        ownerLastName: formData.ownerLastName,
        ownerPhone: formData.ownerPhone,
        ownerEmail: formData.ownerEmail,
        objectName: formData.objectName,
        address: formData.address,
        objectTypeId: Number(formData.objectTypeId),
        municipalityId: Number(formData.municipalityId),
      }).unwrap();

      toast.success("Zahtjev uspješno poslan!");
      setIsRegistrationOpen(false);

      setFormData({
        ownerFirstName: "",
        ownerLastName: "",
        ownerPhone: "",
        ownerEmail: "",
        objectName: "",
        address: "",
        objectTypeId: 0,
        municipalityId: 0,
      });
    } catch {
      toast.error("Greška prilikom slanja zahtjeva.");
    }
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

            {(currentUser?.role === "Officer" || currentUser?.role === "Admin") && (
              <Button
                style={{ backgroundColor: "#5C5C99", color: "white" }}
                onClick={() => navigate("/add-object")}
              >
                Dodaj novi objekat
              </Button>
            )}

            {currentUser?.role === "Visitor" && (
              <Button
                style={{ backgroundColor: "#5c5c99", color: "white" }}
                onClick={() => setIsRegistrationOpen(true)}
              >
                Registruj svoj objekat
              </Button>
            )}
          </div>

          <AllObjects objects={objects} />

          {pagination && (
            <div className="mt-auto pt-6 flex justify-center">
              <ObjectsPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(page) => {
                  dispatch(setPageNumber(page));
                  window.scrollTo({ top: 0, behavior: "smooth" }); 
                }}
              />

            </div>
          )}
        </div>

        <div className="w-full lg:w-80">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Filteri</h3>

            <div className="space-y-6">
              <Filters
                title="Tip objekta"
                typesList={filters.types}
                selected={objectParams.objectTypes ? objectParams.objectTypes.split(",") : []}
                onChange={(v) => {
                  dispatch(setType(v.join(",")));
                  dispatch(setPageNumber(1));
                }}
              />

              <Filters
                title="Opština"
                typesList={filters.municipalities}
                selected={objectParams.municipalities ? objectParams.municipalities.split(",") : []}
                onChange={(v) => {
                  dispatch(setMunicipality(v.join(",")));
                  dispatch(setPageNumber(1));
                }}
              />

              <Filters
                title="Kategorija"
                typesList={filters.categories}
                selected={objectParams.categories ? objectParams.categories.split(",") : []}
                onChange={(v) => {
                  dispatch(setCategory(v.join(",")));
                  dispatch(setPageNumber(1));
                }}
              />

              <Filters
                title="Dodatne usluge"
                typesList={filters.additionalServices}
                selected={objectParams.additionalServices ? objectParams.additionalServices.split(",") : []}
                onChange={(v) => {
                  dispatch(setAdditionalServices(v.join(",")));
                  dispatch(setPageNumber(1));
                }}
              />

              <Button variant="outline" className="w-full" onClick={handleResetFilters}>
                Resetuj filtere
              </Button>
            </div>
          </div>
        </div>
      </div>

      <MapSection markers={markers} />
      <Footer />

      <Modal isOpen={isRegistrationOpen} onClose={() => setIsRegistrationOpen(false)}>
        <h2 className="text-2xl font-bold mb-6">Zahtjev za registraciju objekta</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input name="ownerFirstName" placeholder="Ime vlasnika" className="border p-2 rounded" onChange={handleChange} />

          <input name="ownerLastName" placeholder="Prezime vlasnika" className="border p-2 rounded" onChange={handleChange} />

          <input name="ownerPhone" placeholder="Telefon" className="border p-2 rounded" onChange={handleChange} />

          <input name="ownerEmail" placeholder="Email" className="border p-2 rounded" onChange={handleChange} />

          <input name="objectName" placeholder="Naziv objekta" className="border p-2 rounded md:col-span-2" onChange={handleChange} />

          <input name="address" placeholder="Adresa" className="border p-2 rounded md:col-span-2" onChange={handleChange} />

          <select name="objectTypeId" className="border p-2 rounded" onChange={handleChange}>
            <option value="">Tip objekta</option>
            {types1.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <select name="municipalityId" className="border p-2 rounded" onChange={handleChange}>
            <option value="">Opština</option>
            {municipalities1.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          <div className="md:col-span-2 flex justify-end mt-4">
            <Button type="submit" style={{ backgroundColor: "#5C5C99", color: "white" }}>
              Pošalji zahtjev
            </Button>
          </div>

        </form>
      </Modal>
    </div>
  );
};

export default Objects;