import { useMemo } from "react";
import { useGetEvaluationsForObjectQuery } from "@/store/api/evaluationApi";

interface Props {
  objectId: number;
}

const CategorizationSection = ({ objectId }: Props) => {
  const { data: evaluations, isLoading } =
    useGetEvaluationsForObjectQuery(objectId);

  const latestEvaluation = useMemo(() => {
    if (!evaluations || evaluations.length === 0) return null;

    return [...evaluations].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )[0];
  }, [evaluations]);

  const validityYears = 4;

  const categorizationData = useMemo(() => {
    if (!latestEvaluation) return null;

    const issuedDate = new Date(latestEvaluation.createdAt);
    const expiryDate = new Date(issuedDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + validityYears);

    const now = new Date();

    const isExpired = now > expiryDate;

    const monthsDiff =
      (expiryDate.getFullYear() - now.getFullYear()) * 12 +
      (expiryDate.getMonth() - now.getMonth());

    const isExpiringSoon = !isExpired && monthsDiff <= 6;

    let status = "Važeće";
    let statusColor = "text-green-600";

    if (isExpired) {
      status = "Isteklo";
      statusColor = "text-red-600";
    } else if (isExpiringSoon) {
      status = "Ističe uskoro";
      statusColor = "text-yellow-600";
    }

    return {
      issuedDate,
      expiryDate,
      status,
      statusColor,
    };
  }, [latestEvaluation]);

  if (isLoading) return null;

  if (!latestEvaluation)
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Kategorizacija objekta
        </h2>
        <p className="text-gray-500">
          Objekat još uvijek nema izvršenu kategorizaciju.
        </p>
      </div>
    );

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold">
        Kategorizacija objekta
      </h2>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Kategorija</p>
          <p className="font-medium text-lg">
            {latestEvaluation.categoryName}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Ukupno bodova</p>
          <p className="font-medium">
            {latestEvaluation.totalPoints}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Datum izdavanja</p>
          <p className="font-medium">
            {categorizationData?.issuedDate.toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Važi do</p>
          <p className="font-medium">
            {categorizationData?.expiryDate.toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Status</p>
          <p className={`font-medium ${categorizationData?.statusColor}`}>
            {categorizationData?.status}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Kategorizaciju izvršio</p>
          <p className="font-medium">
            {latestEvaluation.officerFullName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategorizationSection;