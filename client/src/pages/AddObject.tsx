import Header from "../components/Header";
import Footer from "../components/Footer";
import TouristObjectForm from "../components/all-objects/TouristObjectForm";

const AddObject = () => {

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 mt-20">
      <Header />
      <div className="flex-1 max-w-4xl mx-auto py-8 px-4">
        <TouristObjectForm/>
      </div>
      <Footer />
    </div>
  );
};

export default AddObject;
