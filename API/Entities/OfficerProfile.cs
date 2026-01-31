using API.Entities;

public class OfficerProfile
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Position { get; set; } = string.Empty;
    public int MunicipalityId { get; set; }  
    public Municipality Municipality { get; set; } = null!;

    public User User { get; set; } = null!;
}
