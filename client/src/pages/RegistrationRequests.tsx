import Header from "../components/Header";
import Footer from "../components/Footer";
import PagesHero from "../sections/PagesHero";
import LoadingSpinner from "@/components/ui/loading";
import { Button } from "@/components/ui/button";

import { useGetRequestsQuery, useUpdateStatusMutation } from "@/store/api/registrationRequestsApi";
import { useAppSelector } from "@/store/store";

const RegistrationRequestsPage = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const isSluzbenik = currentUser?.role === "Officer";

  const { data: requests = [], isLoading } = useGetRequestsQuery(undefined, { skip: !isSluzbenik });
  const [updateStatus] = useUpdateStatusMutation();


  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <PagesHero title="Zahtjevi za registraciju objekata" imageSrc="/assets/banner.jpg" />

      <main className="flex-1 max-w-6xl mx-auto px-4 lg:px-8 py-8 w-full">
        {requests?.length === 0 ? (
          <p className="text-center text-gray-600">Trenutno nema zahtjeva.</p>
        ) : (
          <div className="grid gap-4">
            {requests.map((r) => (
              <div key={r.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-semibold">{r.objectName}</p>
                  <p className="text-sm text-gray-500">{r.ownerFirstName} {r.ownerLastName} - {r.ownerEmail}</p>
                  <p className="text-sm text-gray-500">Status: {r.status}</p>
                  <p className="text-xs text-gray-400">Kreirano: {new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  {r.status !== "Prihvaćen" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus({ id: r.id, dto: { status: "Prihvaćen" } })}
                      className="bg-green-300!"
                    >
                      Prihvati
                    </Button>
                  )}
                  {r.status !== "Odbijen" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus({ id: r.id, dto: { status: "Odbijen" } })}
                      className="bg-red-300!"
                    >
                      Odbij
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default RegistrationRequestsPage;