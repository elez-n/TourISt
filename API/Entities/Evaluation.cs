using API.Entities;

public class Evaluation
{
    public int Id { get; set; }
    public int TouristObjectId { get; set; }
    public Guid UserId { get; set; }
    public int TotalPoints { get; set; }
    public int CategoryId { get; set; }
    public DateTime CreatedAt { get; set; }

    public TouristObject TouristObject { get; set; } = null!;
    public User Officer { get; set; } = null!;
    public Category Category { get; set; } = null!;
    public ICollection<EvaluationScore> Scores { get; set; } = new List<EvaluationScore>();
}
