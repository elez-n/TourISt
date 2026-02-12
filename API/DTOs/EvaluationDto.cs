public class EvaluationCreateDto
{
    public int TouristObjectId { get; set; }
    public Guid UserId { get; set; }
    public List<EvaluationScoreDto> Scores { get; set; } = new List<EvaluationScoreDto>();
}

public class EvaluationScoreDto
{
    public int CriteriaId { get; set; }
    public string CriteriaName { get; set; } = null!;

    public int Points { get; set; }
}
public class EvaluationDto
{
    public int Id { get; set; }
    public int TotalPoints { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public List<EvaluationScoreDto> Scores { get; set; } = new();
    public DateTime CreatedAt { get; set; }        
    public string OfficerFullName { get; set; } = string.Empty;
}
