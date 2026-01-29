import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    user: "Ana M.",
    rating: 5,
    comment: "Predivan objekat, čisto, toplo i osoblje je jako ljubazno.",
    date: "12.01.2026",
  },
  {
    id: 2,
    user: "Marko P.",
    rating: 4,
    comment: "Odlična lokacija, malo slabiji WiFi u sobama.",
    date: "05.01.2026",
  },
];

const ReviewsSection = () => {
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Recenzije</h2>

      <div className="flex items-center gap-4">
        <div className="text-4xl font-bold">
          {averageRating.toFixed(1)}
        </div>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.round(averageRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>

        <span className="text-muted-foreground text-sm">
          ({reviews.length} recenzije)
        </span>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{r.user}</span>
                <span className="text-xs text-muted-foreground">
                  {r.date}
                </span>
              </div>

              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < r.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>

              <p className="text-muted-foreground text-sm">
                {r.comment}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold">Ostavite recenziju</h3>

          <Textarea placeholder="Napišite vašu recenziju..." />

          <Button className="w-fit">
            Pošalji recenziju
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default ReviewsSection;
