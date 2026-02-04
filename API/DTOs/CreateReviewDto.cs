namespace API.DTOs
{
    public class CreateReviewDto
    {
        public int TouristObjectId { get; set; }
        public int Rating { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
