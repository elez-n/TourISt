namespace API.DTOs;

public class RegistrationRequestDto
{
    public string OwnerFirstName { get; set; } = null!;
    public string OwnerLastName { get; set; } = null!;
    public string OwnerPhone { get; set; } = null!;
    public string OwnerEmail { get; set; } = null!;
    public string ObjectName { get; set; } = null!;
    public int ObjectTypeId { get; set; }
    public int MunicipalityId { get; set; }
    public string Address { get; set; } = null!;
}
public class GetRegistrationRequestDto
{
    public int Id { get; set; }
    public string OwnerFirstName { get; set; } = null!;
    public string OwnerLastName { get; set; } = null!;
    public string OwnerPhone { get; set; } = null!;
    public string OwnerEmail { get; set; } = null!;
    public string ObjectName { get; set; } = null!;
    public string ObjectType { get; set; } = null!;
    public string Municipality { get; set; } = null!;
    public string Address { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}

public class UpdateStatusDto
{
    public string Status {get; set;} = null!;
}