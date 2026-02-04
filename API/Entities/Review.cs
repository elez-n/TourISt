namespace API.Entities
{
    public class Review
    {
        public int Id { get; set; }

        public string Description { get; set; } = null!;

        public int Rating { get; set; } 

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int TouristObjectId { get; set; }
        public TouristObject TouristObject { get; set; } = null!;

        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
