public class FavoriteDto
{
    public int ObjectId { get; set; }
}

public class FavoriteObjectDto : ObjectDto
{
    public DateTime AddedAt { get; set; }
}
