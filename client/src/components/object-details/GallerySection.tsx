import type { PhotographDto } from "@/store/types/TouristObject";
import { useState } from "react";

interface GallerySectionProps {
  photographs?: PhotographDto[];
}

const GallerySection = ({ photographs = [] }: GallerySectionProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImg(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const prevImage = () =>
    setCurrentImg((prev) => (prev === 0 ? photographs.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrentImg((prev) => (prev === photographs.length - 1 ? 0 : prev + 1));

  if (!photographs || photographs.length === 0) return null;

  const maxVisible = 5; // koliko slika da prikazuje u gridu
  const extraCount = photographs.length - maxVisible; // koliko ih ostaje skriveno
  const visiblePhotos = photographs.slice(0, maxVisible);

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-xl overflow-hidden">
      {visiblePhotos.map((img, index) => {
        // zadnja slika sa overlay-om
        const isLastVisible = index === maxVisible - 1 && extraCount > 0;

        return (
          <div
            key={img.id}
            className={`cursor-pointer relative ${
              index === 0 ? "md:col-span-2 md:row-span-2" : ""
            }`}
            onClick={() => openLightbox(index)}
          >
            <img
              src={`https://localhost:5001${img.url}`}
              alt={`Gallery ${index}`}
              className="w-full h-full object-cover rounded-xl"
            />
            {isLastVisible && (
              <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold rounded-xl">
                +{extraCount}
              </div>
            )}
          </div>
        );
      })}

      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            className="absolute top-5 right-5 text-white text-3xl font-bold"
            onClick={closeLightbox}
          >
            &times;
          </button>
          <button
            className="absolute left-5 text-white text-3xl font-bold"
            onClick={prevImage}
          >
            &#10094;
          </button>
          <img
            src={`https://localhost:5001${photographs[currentImg].url}`}
            alt={`Lightbox ${currentImg}`}
            className="max-h-[90vh] max-w-[90vw] rounded-xl"
          />
          <button
            className="absolute right-5 text-white text-3xl font-bold"
            onClick={nextImage}
          >
            &#10095;
          </button>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
