namespace API.Entities
{
    public class AdditionalService
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        // M:N veza sa objektima
        public ICollection<TouristObject> TouristObjects { get; set; } = new List<TouristObject>();
    }
}