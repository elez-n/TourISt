import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Objekat = {
  id: number;
  naziv: string;
  vrsta: string;
  opstina: string;
  kategorija: string;
  status: string;
  slike: string[];
};

const mockObjekti: Objekat[] = [
  {
    id: 1,
    naziv: "Hotel Romanija",
    vrsta: "Hotel",
    opstina: "Istočno Novo Sarajevo",
    kategorija: "3*",
    status: "Aktivan",
    slike: [
      "https://picsum.photos/400/300?random=1",
      "https://picsum.photos/400/300?random=2",
    ],
  },
  {
    id: 2,
    naziv: "Apartmani Jahorina",
    vrsta: "Apartman",
    opstina: "Pale",
    kategorija: "2*",
    status: "Aktivan",
    slike: ["https://picsum.photos/400/300?random=3"],
  },
];

const ListaObjekata = () => {
  const [filterVrsta, setFilterVrsta] = useState<string>("all");
  const [filterOpstina, setFilterOpstina] = useState<string>("all");

const [objekti] = useState<Objekat[]>(mockObjekti);


  const filtrirani = objekti.filter(
    (o) =>
      (filterVrsta === "all" || o.vrsta === filterVrsta) &&
      (filterOpstina === "all" || o.opstina === filterOpstina)
  );

  return (
    <section className="w-full py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-semibold text-center mb-10">
          Turistički objekti
        </h1>

        {/* FILTERI */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Select value={filterVrsta} onValueChange={setFilterVrsta}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vrsta objekta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Sve vrste</SelectItem>
              <SelectItem value="Hotel">Hotel</SelectItem>
              <SelectItem value="Apartman">Apartman</SelectItem>
              <SelectItem value="Pansion">Pansion</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterOpstina} onValueChange={setFilterOpstina}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Opština" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Sve opštine</SelectItem>
              <SelectItem value="Istočno Novo Sarajevo">
                Istočno Novo Sarajevo
              </SelectItem>
              <SelectItem value="Pale">Pale</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* GRID KARTICA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrirani.map((o) => (
            <Card key={o.id} className="overflow-hidden">
              {o.slike.length > 0 && (
                <img
                  src={o.slike[0]}
                  alt={o.naziv}
                  className="h-48 w-full object-cover"
                />
              )}

              <CardContent className="pt-4">
                <CardTitle className="text-lg">{o.naziv}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {o.vrsta} • {o.opstina} • {o.kategorija}
                </p>
                <p className="text-sm mt-1">
                  Status:{" "}
                  <span className="font-medium">{o.status}</span>
                </p>
              </CardContent>

              <CardFooter>
                <Button variant="outline" className="w-full">
                  Detalji
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListaObjekata;
