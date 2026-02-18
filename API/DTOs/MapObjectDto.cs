namespace API.DTOs
{
    public class MapObjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public double Coordinate1 { get; set; }
        public double Coordinate2 { get; set; }
        public string? MunicipalityName { get; set; }
        public string? CategoryName { get; set; }
        public string? ThumbnailUrl { get; set; }
    }
}
