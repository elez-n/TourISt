public class ReportDto
{
    public List<int>? ObjectTypeIds { get; set; } = new();
    public List<int>? CategoryIds { get; set; } = new();
    public List<int>? MunicipalityIds { get; set; } = new();
    public bool? Status { get; set; }
    public string? Sort { get; set; }

}