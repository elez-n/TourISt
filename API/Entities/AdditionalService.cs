namespace API.Entities
{
    public class AdditionalService
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public ICollection<TouristObject> TouristObjects { get; set; } = new List<TouristObject>();
    }
}