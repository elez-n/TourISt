// src/sections/GallerySection.tsx
import { useState } from "react";
import img1 from "@/assets/grad1.jpg";
import img2 from "@/assets/grad2.jpg";
import img3 from "@/assets/grad3.jpg";
import img4 from "@/assets/grad1.jpg";
import img5 from "@/assets/grad2.jpg";

const images = [img1, img2, img3, img4, img5];

const GallerySection = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImg(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prevImage = () =>
    setCurrentImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrentImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-xl overflow-hidden">
      
      {/* Glavna slika */}
      <div
        className="md:col-span-2 md:row-span-2 cursor-pointer"
        onClick={() => openLightbox(0)}
      >
        <img
          src={images[0]}
          alt="Main"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* Ostale slike */}
      {images.slice(1).map((img, index) => (
        <div
          key={index}
          className="cursor-pointer"
          onClick={() => openLightbox(index + 1)}
        >
          <img
            src={img}
            alt={`Gallery ${index + 1}`}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      ))}

      {/* Lightbox modal */}
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
            src={images[currentImg]}
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
