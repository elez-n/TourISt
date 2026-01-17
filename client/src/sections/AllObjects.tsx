import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";


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


  return (
    <section className="w-full py-16">
      <div className="max-w-7xl mx-auto px-4">


        {/* GRID KARTICA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockObjekti.map((o) => (
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
