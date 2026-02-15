"use client";

import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trash2, Edit2, Heart } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ObjectHeader from "@/components/object-details/ObjectHeader";
import GallerySection from "@/components/object-details/GallerySection";
import MainInfoSection from "@/components/object-details/MainInfoSection";
import AmenitiesSection from "@/components/object-details/AmenitiesSection";
import OwnerSection from "@/components/object-details/OwnerSection";
import MapSection from "@/sections/MapSection";
import ReviewsSection from "@/components/object-details/ReviewsSection";
import { EvaluationForm } from "@/components/object-details/EvaluationForm";

import TouristObjectForm from "../components/all-objects/TouristObjectForm";
import { useGetTouristObjectByIdQuery, useDeleteTouristObjectMutation } from "../store/api/TouristObjectApi";
import LoadingSpinner from "@/components/ui/loading";
import { Modal } from "@/components/object-details/Modal";

import { useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } from "@/store/api/favoritesApi";
import { useAppSelector } from "@/store/store"; // Dodaj auth state

const ObjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.user); // Provjera da li je korisnik logovan

  const { data: object, isLoading, isError, refetch } = useGetTouristObjectByIdQuery(Number(id));
  const [deleteObject, { isLoading: isDeleting }] = useDeleteTouristObjectMutation();

  const [editMode, setEditMode] = useState(false);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);

  const { data: favorites = [] } = useGetFavoritesQuery();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const favoriteIds = useMemo(() => new Set(favorites.map(f => f.id)), [favorites]);
  const isFavorite = object ? favoriteIds.has(object.id) : false;

  const toggleFavorite = async () => {
    if (!object) return;
    try {
      if (isFavorite) {
        await removeFavorite(object.id);
      } else {
        await addFavorite(object.id);
      }
    } catch {
      alert("Greška pri izmjeni omiljenih");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Da li ste sigurni da želite obrisati objekat?")) return;
    try {
      await deleteObject(id).unwrap();
      navigate("/objects");
    } catch {
      alert("Greška pri brisanju objekta");
    }
  };

  if (isLoading) return <LoadingSpinner />;

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
          <div className="flex items-center gap-4">
            <ObjectHeader object={object} />
            
            {user && (
              <button
                onClick={toggleFavorite}
                className={`p-1 rounded-full transition ${isFavorite ? "text-red-500" : "text-gray-400"} `}
                title={isFavorite ? "Ukloni iz omiljenih" : "Dodaj u omiljene"}
              >
                <Heart size={28} />
              </button>
            )}
          </div>

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

            <button
              onClick={() => setShowEvaluationForm(true)}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition flex items-center gap-1"
            >
              <span className="text-sm">Dodaj evaluaciju</span>
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
            <ReviewsSection
              objectId={object.id}
              averageRating={object.averageRating}
              reviewCount={object.reviewCount}
              refetchObject={refetch}
            />
          </>
        )}
      </div>

      <Modal isOpen={showEvaluationForm} onClose={() => setShowEvaluationForm(false)}>
        <h2 className="text-lg font-semibold mb-4">Evaluacija objekta</h2>
        <EvaluationForm
          touristObjectId={object.id}
          onSuccess={() => {
            setShowEvaluationForm(false);
            refetch();
          }}
        />
      </Modal>

      <Footer />
    </>
  );
};

export default ObjectDetailsPage;
