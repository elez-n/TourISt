import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";

const objects = [
  { id: 1, name: "Hotel Romanija", type: "Hotel", municipality: "Pale" },
  { id: 2, name: "Apartmani Jahorina", type: "Apartman", municipality: "Pale" },
  { id: 3, name: "Pansion Trebević", type: "Pansion", municipality: "Istočni Stari Grad" },
];

const FeaturedObjects = () => {
  return (
    <section className="w-full py-16 bg-muted">
      {/* centrirani sadržaj */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-8">
          Izdvojeni objekti
        </h2>

        {/* RESPONSIVE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {objects.map((obj) => (
            <Card key={obj.id} className="overflow-hidden">
              <img
                src="https://source.unsplash.com/400x300/?hotel"
                alt={obj.name}
                className="h-40 w-full object-cover"
              />

              <CardContent className="pt-4">
                <CardTitle className="text-lg">
                  {obj.name}
                </CardTitle>

                <p className="text-sm text-muted-foreground mt-1">
                  {obj.type} • {obj.municipality}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedObjects;
