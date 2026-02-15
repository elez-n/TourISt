using API.DTOs;
public class ObjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string ObjectTypeName { get; set; } = null!;
    public bool Status { get; set; }
    public string Address { get; set; } = null!;
    public double Coordinate1 { get; set; }
    public double Coordinate2 { get; set; }
    public string ContactPhone { get; set; } = null!;
    public string ContactEmail { get; set; } = null!;
    public int NumberOfUnits { get; set; }
    public int NumberOfBeds { get; set; }
    public string Description { get; set; } = null!;
    public string Owner { get; set; } = null!;
    public bool Featured { get; set; }

    public string? CategoryName { get; set; }
    public string MunicipalityName { get; set; } = null!;
    public List<string> AdditionalServices { get; set; } = new();
    public List<PhotographDto> Photographs { get; set; } = new();
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
}
