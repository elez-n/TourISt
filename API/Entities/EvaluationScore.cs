public class EvaluationScore
{
    public int Id { get; set; }
    public int EvaluationId { get; set; }
    public int CriteriaId { get; set; }
    public int Points { get; set; }

    public Evaluation Evaluation { get; set; } = null!;
    public Criteria Criteria { get; set; } = null!;
}
