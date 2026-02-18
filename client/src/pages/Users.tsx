import Header from "../components/Header";
import Footer from "../components/Footer";
import PagesHero from "../sections/PagesHero";
import background1 from "../assets/background1.jpg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { setPageNumber, setSearchTerm, setRole, setOrderBy, resetParams } from "@/store/slice/userSlice";
import { useGetUsersQuery, useToggleUserActiveStatusMutation } from "@/store/api/adminApi";
import { LucideSearch, LucideUserX, LucideUserCheck } from "lucide-react";
import ObjectsPagination from "@/components/all-objects/ObjectsPagination";

const Users = () => {
  const dispatch = useAppDispatch();
  const userParams = useAppSelector((state) => state.user);
  const { data, isLoading, error, refetch } = useGetUsersQuery(userParams);
  const [toggleUserStatus] = useToggleUserActiveStatusMutation();

  const handleSearchChange = (value: string) => {
    dispatch(setSearchTerm(value));
    dispatch(setPageNumber(1));
  };

  const handleRoleChange = (value: string) => {
    dispatch(setRole(value));
    dispatch(setPageNumber(1));
  };

  const handleSortChange = (value: string) => {
    dispatch(setOrderBy(value));
    dispatch(setPageNumber(1));
  };

  const handleResetFilters = () => {
    dispatch(resetParams());
    dispatch(setPageNumber(1));
  };

  const handleToggleStatus = async (id: string, username: string, isActive: boolean) => {
    const action = isActive ? "deaktivirati" : "aktivirati";
    if (confirm(`Da li ste sigurni da želite ${action} korisnika ${username}?`)) {
      try {
        await toggleUserStatus(id).unwrap();
        refetch();
      } catch {
        alert("Greška prilikom izmjene statusa korisnika.");
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center py-6">Greška prilikom učitavanja korisnika.</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <PagesHero title="Korisnici" imageSrc={background1} />

      <div className="flex-1 max-w-7xl mx-auto flex flex-col gap-6 px-4 lg:px-8 py-6 w-full">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Pretraži korisnike..."
              value={userParams.searchTerm || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pr-10"
            />
            <LucideSearch className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          <select
            value={userParams.role || ""}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="p-2 border rounded shadow-sm bg-white"
          >
            <option value="">Sve role</option>
            <option value="Admin">Admin</option>
            <option value="Officer">Officer</option>
          </select>

          <select
            value={userParams.orderBy || "username"}
            onChange={(e) => handleSortChange(e.target.value)}
            className="p-2 border rounded shadow-sm bg-white flex items-center"
          >
            <option value="username">Sortiraj</option>
            <option value="name">Ime A → Z</option>
            <option value="namedesc">Ime Z → A</option>
            <option value="lastname">Prezime A → Z</option>
            <option value="lastnamedesc">Prezime Z → A</option>
          </select>

          <Button variant="outline" onClick={handleResetFilters}>Resetuj filtere</Button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md bg-white">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b font-medium text-gray-700">Username</th>
                <th className="p-3 border-b font-medium text-gray-700">Ime</th>
                <th className="p-3 border-b font-medium text-gray-700">Prezime</th>
                <th className="p-3 border-b font-medium text-gray-700">Email</th>
                <th className="p-3 border-b font-medium text-gray-700">Role</th>
                <th className="p-3 border-b font-medium text-gray-700">Aktivan</th>
                <th className="p-3 border-b font-medium text-gray-700">Posljednja aktivnost</th>
                <th className="p-3 border-b font-medium text-gray-700">Akcija</th>
              </tr>
            </thead>
            <tbody>
              {data?.users.map((user, idx) => (
                <tr key={user.id} className={`hover:bg-gray-50 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <td className="p-3 border-b">{user.username}</td>
                  <td className="p-3 border-b">{user.firstName}</td>
                  <td className="p-3 border-b">{user.lastName}</td>
                  <td className="p-3 border-b">{user.email}</td>
                  <td className="p-3 border-b">{user.role}</td>
                  <td className="p-3 border-b">{user.isActive ? "Da" : "Ne"}</td>
                  <td className="p-3 border-b">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString("sr-RS", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                      })
                      : "-"}
                  </td>
                  <td className="p-3 border-b">
                    <Button
                      size="sm"
                      className={`flex items-center gap-1 ${user.isActive ? "bg-red-300! hover:bg-red-400! text-white" : "bg-green-300! hover:bg-green-400! text-white"
                        }`}
                      onClick={() => handleToggleStatus(user.id, user.username, user.isActive)}
                    >
                      {user.isActive ? <LucideUserX className="w-4 h-4" /> : <LucideUserCheck className="w-4 h-4" />}
                      {user.isActive ? "Deaktiviraj" : "Aktiviraj"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data?.pagination && (
          <div className="mt-6 flex justify-center">
            <ObjectsPagination
              currentPage={data.pagination.currentPage}
              totalPages={data.pagination.totalPages}
              onPageChange={(page) => dispatch(setPageNumber(page))}
            />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Users;
