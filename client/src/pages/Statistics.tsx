import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PagesHero from "../sections/PagesHero";
import { Box, Chip, Typography } from "@mui/material";
import LoadingSpinner from "../components/ui/loading";
import { useGetStatisticsQuery } from "@/store/api/statisticsApi";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend
} from "recharts";
import background from "../assets/mapa.jpg";
import { useAppSelector } from "@/store/store";

const COLORS = ["#1E3A8A", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE"];

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value?: number | string }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const value = payload[0].value ?? 0;
    return (
      <Box sx={{ bgcolor: "white", p: 1.5, borderRadius: 1, boxShadow: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="textPrimary">{value}</Typography>
      </Box>
    );
  }
  return null;
};

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col hover:shadow-xl transition-shadow duration-300">
    <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
    {children}
  </div>
);

const StatisticsPage: React.FC = () => {
  const { data, isLoading, isError } = useGetStatisticsQuery();
  const currentUser = useAppSelector((state) => state.auth.user);
  const isOfficer = currentUser?.role === "Officer";

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <div className="text-center mt-10 text-red-500">Error loading statistics</div>;

  return (
    <Box className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <PagesHero title="Statistika objekata" imageSrc={background} />

      <Box className="flex-1 max-w-7xl mx-auto px-4 lg:px-8 py-8 w-full space-y-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Ukupno objekata">
            <p className="text-3xl font-bold text-center text-blue-700">{data.generalStats.totalObjects}</p>
          </Card>
          <Card title="Aktivni objekti">
            <p className="text-3xl font-bold text-center text-blue-600">{data.generalStats.totalActiveObjects}</p>
          </Card>
          <Card title="Neaktivni objekti">
            <p className="text-3xl font-bold text-center text-blue-400">{data.generalStats.totalInactiveObjects}</p>
          </Card>
        </div>

        {!isOfficer && (
          <Card title="Objekti po opštinama">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.objectsByMunicipality} barCategoryGap="30%" margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="municipality" tick={{ fill: "#1E3A8A", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#1E3A8A", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        <Card title="Objekti po tipu">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.objectsByType}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={40}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {data.objectsByType.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Objekti po kategoriji">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.objectsByCategory} barCategoryGap="35%" margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" tick={{ fill: "#1E3A8A", fontSize: 12 }} />
                <YAxis tick={{ fill: "#1E3A8A", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#60A5FA" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Objekti po ocjenama">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.objectsByRatingRange} barCategoryGap="35%" margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" tick={{ fill: "#1E3A8A", fontSize: 12 }} />
                <YAxis tick={{ fill: "#1E3A8A", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#93C5FD" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {!isOfficer && (
          <Card title="Broj kreveta po opštinama">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.bedsByMunicipality} barCategoryGap="35%" margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="municipality" tick={{ fill: "#1E3A8A", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#1E3A8A", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="totalBeds" fill="#BFDBFE" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        <Card title="Top 5 najrecenziranijih objekata">
          <ul className="space-y-2">
            {data.topReviewedOverall.map((obj, i) => (
              <li key={i} className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm hover:bg-gray-100 transition">
                <span>{obj.name} {!isOfficer && `(${obj.municipality})`}</span>
                <Chip label={`${obj.reviewCount} recenzija • ${obj.averageRating.toFixed(1)}★`} color="primary" size="small" />
              </li>
            ))}
          </ul>
        </Card>

        {!isOfficer && data.topReviewedPerMunicipality.map((muni, idx) => (
          <Card key={idx} title={`Top objekti u ${muni.municipality}`}>
            <ul className="space-y-2">
              {muni.topObjects.map((obj, i) => (
                <li key={i} className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm hover:bg-gray-100 transition">
                  <span>{obj.name}</span>
                  <Chip label={`${obj.reviewCount} recenzija • ${obj.averageRating.toFixed(1)}★`} color="primary" size="small" />
                </li>
              ))}
            </ul>
          </Card>
        ))}

      </Box>

      <Footer />
    </Box>
  );
};

export default StatisticsPage;