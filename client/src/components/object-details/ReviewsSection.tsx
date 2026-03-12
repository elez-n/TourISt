import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useGetReviewsForObjectQuery, useCreateReviewMutation } from "../../store/api/reviewsApi";
import LoadingSpinner from "@/components/ui/loading";
import { useAppSelector } from "@/store/store"; 
import { toast } from "sonner";

interface ReviewsSectionProps {
  objectId: number;
  averageRating: number;
  reviewCount: number;
  refetchObject: () => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ objectId, averageRating, reviewCount, refetchObject }) => {
  const { data: reviews = [], isLoading, refetch } = useGetReviewsForObjectQuery(objectId);
  const [createReview, { isLoading: submitting }] = useCreateReviewMutation();

  const user = useAppSelector(state => state.auth.user); 

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);

  const [visibleCount, setVisibleCount] = useState(5);
  const reviewsToShow = useMemo(() => reviews.slice(0, visibleCount), [reviews, visibleCount]);

  const handleSubmit = async () => {
    if (!newComment) return toast.error("Napišite komentar!");
    if (!newRating) return toast.error("Odaberite ocjenu!");

    try {
      await createReview({ objectId, rating: newRating, description: newComment }).unwrap();
      refetchObject();
      refetch();
      setNewComment("");
      setNewRating(0);
      setVisibleCount((prev) => prev + 1);
    } catch {
      toast.error("Greška pri slanju recenzije.");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const displayedAverageRating = averageRating;
  const displayedReviewCount = reviewCount;

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Recenzije</h2>

      <div className="flex items-center gap-4">
        <div className="text-4xl font-bold">{displayedAverageRating.toFixed(1)}</div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < Math.round(displayedAverageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <span className="text-muted-foreground text-sm">({displayedReviewCount} recenzije)</span>
      </div>

      <div className="space-y-4">
        {reviewsToShow.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-3 space-y-0">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{r.fullName}</span>
                <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                  />
                ))}
              </div>

              <p className="text-muted-foreground text-sm">{r.description}</p>
            </CardContent>
          </Card>
        ))}

        {visibleCount < reviews.length && (
          <Button onClick={() => setVisibleCount((prev) => prev + 5)} className="w-full bg-[#272757]!">
            Učitaj još
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          {user ? (
            <>
              <h3 className="font-semibold">Ostavite recenziju</h3>

              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    onClick={() => setNewRating(i + 1)}
                    className={`w-6 h-6 cursor-pointer ${i < newRating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                  />
                ))}
              </div>

              <Textarea
                placeholder="Napišite vašu recenziju..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />

              <Button onClick={handleSubmit} disabled={submitting} className="bg-[#5c5c99]! hover:bg-[#272757]!">
                {submitting ? "Slanje..." : "Pošalji recenziju"}
              </Button>
            </>
          ) : (
            <div className="border border-gray-200 rounded-lg bg-gray-50 p-6 text-center text-gray-700 font-medium">
                Prijavite se da biste ostavili recenziju.
            </div>

          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default ReviewsSection;
