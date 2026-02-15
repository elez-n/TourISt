public class EvaluationCreateDto
{
    public int TouristObjectId { get; set; }
    public Guid UserId { get; set; }
    public List<EvaluationScoreDto> Scores { get; set; } = new List<EvaluationScoreDto>();
}
    public class CriteriaDto
    {
        public int Id { get; set; }                // ID kriterija
        public string Name { get; set; } = string.Empty;  // Naziv kriterija
        public int MaxPoints { get; set; }         // Maksimalni broj bodova koji se može dodijeliti za ovaj kriterij
        public string? Description { get; set; }
    }

public class EvaluationScoreDto
{
    public int CriteriaId { get; set; }
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
