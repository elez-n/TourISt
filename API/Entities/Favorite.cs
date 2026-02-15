using API.Entities;

public class Favorite
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public int TouristObjectId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
    public TouristObject TouristObject { get; set; } = null!;
}
