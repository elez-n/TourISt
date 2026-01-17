import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OwnerSection = () => {
  return (
    <section>
      <Card>
        <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">Vlasnik objekta</h3>
            <p className="text-muted-foreground">Petar Petrović</p>
            <p className="text-muted-foreground text-sm">
              +387 65 123 456
            </p>
          </div>

          <Button>Kontaktiraj vlasnika</Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default OwnerSection;
