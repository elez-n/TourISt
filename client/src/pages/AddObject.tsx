import Header from "../components/Header";
import Footer from "../components/Footer";
import TouristObjectForm from "../components/all-objects/TouristObjectForm";
//import { useGetTouristObjectsQuery } from "@/store/api/TouristObjectApi";

const AddObject = () => {
  //const { refetch } = useGetTouristObjectsQuery({}); // da prosledimo refetch ako treba

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 mt-20">
      <Header />
      <div className="flex-1 max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Dodaj novi objekat</h1>
        <TouristObjectForm/>
      </div>
      <Footer />
    </div>
  );
};

export default AddObject;
