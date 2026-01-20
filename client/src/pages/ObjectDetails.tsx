import { useParams } from "react-router-dom";
import { useGetTouristObjectByIdQuery } from "../store/api/TouristObjectApi";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ObjectHeader from "@/components/object-details/ObjectHeader";
import GallerySection from "@/components/object-details/GallerySection";
import MainInfoSection from "@/components/object-details/MainInfoSection";
import AmenitiesSection from "@/components/object-details/AmenitiesSection";
import OwnerSection from "@/components/object-details/OwnerSection";
import MapSection from "@/sections/MapSection";
import ReviewsSection from "@/components/object-details/ReviewsSection";

const ObjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: object,
    isLoading,
    isError,
  } = useGetTouristObjectByIdQuery(Number(id));

  if (isLoading)
    return <div className="text-center py-20">Učitavanje...</div>;

  if (isError || !object)
    return (
      <div className="text-center py-20 text-red-500">
        Objekat nije pronađen
      </div>
    );

  // ✅ SAMO JEDAN MARKER – LOKACIJA OBJEKTA
  const markers = [
    {
      id: object.id,
      name: object.name,
      position: [object.coordinate1, object.coordinate2] as [number, number],
    },
  ];

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-4 space-y-16 py-10 mt-30">
        <ObjectHeader object={object} />

        <GallerySection photographs={object.photographs} />

        <MainInfoSection object={object} />

        <AmenitiesSection additionalServices={object.additionalServices} />

        <OwnerSection
          owner={object.owner}
          contactPhone={object.contactPhone}
          email={object.contactEmail}
        />

        {/* 📍 MAPA – SAMO OVAJ OBJEKAT */}
        <MapSection
          title="Lokacija objekta"
          markers={markers}
          selectedId={object.id}
        />

        <ReviewsSection />
      </div>

      <Footer />
    </>
  );
};

export default ObjectDetailsPage;
