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
import { useAppSelector } from "@/store/store";
import CategorizationSection from "@/components/object-details/CategorizationSection";

const ObjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.user);

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

      <main className="max-w-7xl mx-auto px-4 space-y-12 py-10 mt-20">
        {/* Header i akcije */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
          <ObjectHeader object={object} />
          <div className="flex items-center gap-2 flex-wrap">
            {user && (
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition ${isFavorite ? "text-red-500 bg-gray-100" : "text-gray-400 hover:text-red-500"
                  }`}
                title={isFavorite ? "Ukloni iz omiljenih" : "Dodaj u omiljene"}
              >
                <Heart size={28} />
              </button>
            )}

            {(user?.role === "Admin" || user?.role === "Officer") && (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-[#5c5c99]! text-white px-4 py-2 rounded-lg hover:bg-[#272757]! transition flex items-center gap-2 text-sm"
                >
                  <Edit2 size={18} /> Uredi objekat
                </button>

                <button
                  onClick={() => setShowEvaluationForm(true)}
                  className="bg-[#5c5c99]! text-white px-4 py-2 rounded-lg hover:bg-[#272757]! transition flex items-center gap-2 text-sm"
                >
                  <Edit2 size={18} /> Postavi kategoriju
                </button>

                <button
                  onClick={() => handleDelete(object.id)}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-700 transition flex items-center gap-2 text-sm"
                  title="Obriši objekat"
                >
                  <Trash2 size={20} /> Obriši objekat
                </button>
              </>
            )}
          </div>
        </div>

        {/* Forma za edit */}
        {editMode ? (
          <TouristObjectForm
            initialData={object}
            setEditMode={setEditMode}
            refetch={() => window.location.reload()}
          />
        ) : (
          <>
            {/* Galerija */}
            <section className="rounded-2xl overflow-hidden shadow-lg">
              <GallerySection photographs={object.photographs} />
            </section>

            {/* Glavne informacije + dodatne usluge */}
            <section className="bg-white rounded-2xl shadow p-6 space-y-6">
              <MainInfoSection object={object} />
              <AmenitiesSection additionalServices={object.additionalServices} />
            </section>

            <CategorizationSection objectId={object.id} />

            {/* Vlasnik objekta */}
            <section className="bg-white rounded-2xl shadow p-6">
              <OwnerSection
                owner={object.owner}
                contactPhone={object.contactPhone}
                email={object.contactEmail}
              />
            </section>

            {/* Mapa */}
            <section className="rounded-2xl overflow-hidden shadow-lg">
              <MapSection
                title="Lokacija objekta"
                markers={markers}
                selectedId={object.id}
              />
            </section>

            {/* Recenzije */}
            <section className="bg-white rounded-2xl shadow p-6">
              <ReviewsSection
                objectId={object.id}
                averageRating={object.averageRating}
                reviewCount={object.reviewCount}
                refetchObject={refetch}
              />
            </section>
          </>
        )}
      </main>

      {/* Modal za kategorizaciju */}
      <Modal isOpen={showEvaluationForm} onClose={() => setShowEvaluationForm(false)}>
        <h2 className="text-lg font-semibold mb-4">Kategorizacija objekta</h2>
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