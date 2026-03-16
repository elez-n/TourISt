namespace API.Entities;

public class RegistrationRequest
{
    public int Id { get; set; }

    public string OwnerFirstName { get; set; } = null!;
    public string OwnerLastName { get; set; } = null!;
    public string OwnerPhone { get; set; } = null!;
    public string OwnerEmail { get; set; } = null!;

    public string ObjectName { get; set; } = null!;
    public int ObjectTypeId { get; set; }
    public int MunicipalityId { get; set; }
    public ObjectType ObjectType { get; set; } = null!;
    public Municipality Municipality { get; set; } = null!;
    public string Address { get; set; } = null!;

    public string Status { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
}