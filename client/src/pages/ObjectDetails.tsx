import ObjectHeader from "@/components/object-details/ObjectHeader";
import GallerySection from "@/components/object-details/GallerySection";
import MainInfoSection from "@/components/object-details/MainInfoSection";
import AmenitiesSection from "@/components/object-details/AmenitiesSection";
import OwnerSection from "@/components/object-details/OwnerSection";
import MapSection from "@/sections/MapSection";
import ReviewsSection from "@/components/object-details/ReviewsSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ObjectDetailsPage = () => {
  return (
    <>
      <Header></Header>
      <div className="max-w-7xl mx-auto px-4 space-y-16 py-10 mt-30">
        <ObjectHeader />
        <GallerySection />
        <MainInfoSection />
        <AmenitiesSection />
        <OwnerSection />
        <MapSection />
        <ReviewsSection />
      </div>
      <Footer/>
    </>
  );
};

export default ObjectDetailsPage;
