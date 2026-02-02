"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trash2, Edit2 } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ObjectHeader from "@/components/object-details/ObjectHeader";
import GallerySection from "@/components/object-details/GallerySection";
import MainInfoSection from "@/components/object-details/MainInfoSection";
import AmenitiesSection from "@/components/object-details/AmenitiesSection";
import OwnerSection from "@/components/object-details/OwnerSection";
import MapSection from "@/sections/MapSection";
import ReviewsSection from "@/components/object-details/ReviewsSection";

import TouristObjectForm from "../components/all-objects/TouristObjectForm";
import { useGetTouristObjectByIdQuery, useDeleteTouristObjectMutation } from "../store/api/TouristObjectApi";
import LoadingSpinner from "@/components/ui/loading";

const ObjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: object, isLoading, isError } = useGetTouristObjectByIdQuery(Number(id));
  const [deleteObject, { isLoading: isDeleting }] = useDeleteTouristObjectMutation();

  const [editMode, setEditMode] = useState(false);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Da li ste sigurni da želite obrisati objekat?")) return;
    try {
      await deleteObject(id).unwrap();
      navigate("/objects");
    } catch {
      alert("Greška pri brisanju objekta");
    }
  };

  if (isLoading)
    return <LoadingSpinner />

  if (isError || !object)
    return (
      <div className="text-center py-20 text-red-500">
        Objekat nije pronađen
      </div>
    );

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

        <div className="flex justify-between items-center">
          <ObjectHeader object={object} />

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditMode(true)}
              className="bg-[#5c5c99]! text-white px-3 py-1 rounded hover:bg-[#272757]! transition flex items-center gap-1"
            >
              <Edit2 size={18} />
              <span className="text-sm">Edituj objekat</span>
            </button>

            <button
              onClick={() => handleDelete(object.id)}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700 transition flex items-center gap-1"
              title="Obriši objekat"
            >
              <Trash2 size={22} />
              <span className="text-sm">Obriši objekat</span>
            </button>
          </div>
        </div>

        {editMode ? (
          <TouristObjectForm
            initialData={object}
            setEditMode={setEditMode}
            refetch={() => window.location.reload()} 
          />
        ) : (
          <>
            <GallerySection photographs={object.photographs} />
            <MainInfoSection object={object} />
            <AmenitiesSection additionalServices={object.additionalServices} />
            <OwnerSection
              owner={object.owner}
              contactPhone={object.contactPhone}
              email={object.contactEmail}
            />
            <MapSection
              title="Lokacija objekta"
              markers={markers}
              selectedId={object.id}
            />
            <ReviewsSection />
          </>
        )}

      </div>

      <Footer />
    </>
  );
};

export default ObjectDetailsPage;
