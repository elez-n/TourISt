import { useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PagesHero from "../sections/PagesHero";
import LoadingSpinner from "../components/ui/loading";
import background1 from "../assets/background1.jpg";

import {
  useGetObjectsReportMutation,
  useGeneratePdfReportMutation,
  useGenerateCsvReportMutation,
  useGenerateXlsxReportMutation,
} from "@/store/api/reportsApi";

import type { ReportDto, ReportResultDto } from "@/store/types/Report";
import { Modal } from "@/components/object-details/Modal";
import {
  useFetchCategoriesQuery,
  useFetchMunicipalitiesQuery,
  useFetchObjectTypesQuery,
} from "@/store/api/TouristObjectApi";

import { selectCurrentUser } from "@/store/slice/authSlice";

const Reports = () => {
  const currentUser = useSelector(selectCurrentUser);

  const [filters, setFilters] = useState<ReportDto>({
    sort: "name",
  });

  const [preview, setPreview] = useState<ReportResultDto[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const [getObjectsReport] = useGetObjectsReportMutation();
  const [generatePdfReport] = useGeneratePdfReportMutation();
  const [generateCsvReport] = useGenerateCsvReportMutation();
  const [generateXlsxReport] = useGenerateXlsxReportMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalBlobUrl, setModalBlobUrl] = useState<string | null>(null);
  const [modalFormat, setModalFormat] =
    useState<"pdf" | "csv" | "xlsx">("pdf");

  const { data: objectTypes = [] } = useFetchObjectTypesQuery();
  const { data: categories = [] } = useFetchCategoriesQuery();
  const { data: municipalities = [] } = useFetchMunicipalitiesQuery();

  const sortOptions = [
    { value: "name", label: "Naziv (A-Z)" },
    { value: "namedesc", label: "Naziv (Z-A)" },
    { value: "stars", label: "Kategorija (1-5)" },
    { value: "starsdesc", label: "Kategorija (5-1)" },
  ];

  const fetchPreview = async () => {
    setLoadingPreview(true);
    try {
      const result = await getObjectsReport(filters).unwrap();
      setPreview(result);
    } catch (err) {
      console.error("Failed to fetch report preview", err);
    }
    setLoadingPreview(false);
  };

  const handleDownload = async (format: "pdf" | "csv" | "xlsx") => {
    try {
      let blob: Blob;
      if (format === "pdf") blob = await generatePdfReport(filters).unwrap();
      else if (format === "csv") blob = await generateCsvReport(filters).unwrap();
      else blob = await generateXlsxReport(filters).unwrap();

      const url = URL.createObjectURL(blob);
      setModalBlobUrl(url);
      setModalFormat(format);
      setModalOpen(true);
    } catch (err) {
      console.error("Failed to generate report", err);
    }
  };

  const downloadFromModal = () => {
    if (!modalBlobUrl) return;
    const a = document.createElement("a");
    a.href = modalBlobUrl;
    a.download = `izvjestaj.${modalFormat}`;
    a.click();
    URL.revokeObjectURL(modalBlobUrl);
    setModalOpen(false);
  };

  const toSelectOptions = (arr: { id: number; name: string }[]) =>
    arr.map((item) => ({ value: item.id, label: item.name }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <PagesHero title="Izvještaji" imageSrc={background1} />

      <div className="flex-1 max-w-7xl mx-auto flex flex-col gap-6 px-4 lg:px-8 py-6 w-full">

        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
          <h2 className="text-lg font-bold">Filteri</h2>

          <div
            className={`grid grid-cols-1 md:grid-cols-${currentUser?.role === "Officer" ? 4 : 5
              } gap-4`}
          >
            <Select
              isMulti
              options={toSelectOptions(objectTypes)}
              placeholder="Tip objekta"
              onChange={(selected) =>
                setFilters({
                  ...filters,
                  objectTypeIds: selected.map((s) => s.value),
                })
              }
            />

            <Select
              isMulti
              options={toSelectOptions(categories)}
              placeholder="Kategorija"
              onChange={(selected) =>
                setFilters({
                  ...filters,
                  categoryIds: selected.map((s) => s.value),
                })
              }
            />

            {currentUser?.role !== "Officer" && (
              <Select
                isMulti
                options={toSelectOptions(municipalities)}
                placeholder="Opština"
                onChange={(selected) =>
                  setFilters({
                    ...filters,
                    municipalityIds: selected.map((s) => s.value),
                  })
                }
              />
            )}

            <select
              className="border rounded p-2"
              value={
                filters.status === undefined
                  ? ""
                  : filters.status
                    ? "true"
                    : "false"
              }
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status:
                    e.target.value === ""
                      ? undefined
                      : e.target.value === "true",
                })
              }
            >
              <option value="">Svi</option>
              <option value="true">Aktivni</option>
              <option value="false">Neaktivni</option>
            </select>

            <Select
              options={sortOptions}
              defaultValue={sortOptions[0]}
              placeholder="Sortiranje"
              onChange={(selected) =>
                setFilters({
                  ...filters,
                  sort: selected?.value,
                })
              }
            />
          </div>

          <button
            className="mt-2 bg-[#5c5c99]! text-white px-4 py-2 rounded hover:bg-[#272757]!"
            onClick={fetchPreview}
          >
            Prikaži preview
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-lg font-bold mb-4">Pregled objekata</h2>

          {loadingPreview ? (
            <LoadingSpinner />
          ) : (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Naziv</th>
                  <th className="border px-4 py-2">Tip</th>
                  <th className="border px-4 py-2">Kategorija</th>
                  <th className="border px-4 py-2">Opština</th>
                  <th className="border px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((o, idx) => (
                  <tr
                    key={idx}
                    className={
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }
                  >
                    <td className="border px-4 py-2">{o.name}</td>
                    <td className="border px-4 py-2">{o.objectType}</td>
                    <td className="border px-4 py-2">{o.category}</td>
                    <td className="border px-4 py-2">{o.municipality}</td>
                    <td className="border px-4 py-2">{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => handleDownload("pdf")}
            className="bg-[#5c5c99]! text-white px-4 py-2 rounded hover:bg-[#272757]!"
          >
            PDF
          </button>
          <button
            onClick={() => handleDownload("csv")}
            className="bg-[#5c5c99]! text-white px-4 py-2 rounded hover:bg-[#272757]!"
          >
            CSV
          </button>
          <button
            onClick={() => handleDownload("xlsx")}
            className="bg-[#5c5c99]! text-white px-4 py-2 rounded hover:bg-[#272757]!"
          >
            XLSX
          </button>
        </div>
      </div>

      <Footer />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">
            Pregled izvještaja ({modalFormat.toUpperCase()})
          </h2>

          {modalFormat === "pdf" ? (
            <iframe
              src={modalBlobUrl ?? ""}
              className="w-full h-150"
              title="PDF preview"
            />
          ) : (
            <p>Format {modalFormat.toUpperCase()} je spreman za preuzimanje.</p>
          )}

          <div className="flex gap-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={downloadFromModal}
            >
              Preuzmi
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              onClick={() => setModalOpen(false)}
            >
              Zatvori
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Reports;