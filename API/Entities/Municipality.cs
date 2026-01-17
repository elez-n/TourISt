namespace API.Entities
{
    public class Municipality
    {
        public int Id { get; set; }           // Primarni ključ
        public string Name { get; set; } = null!;  // Ime opštine

        // Navigaciona property: opština ima više objekata
        public ICollection<TouristObject> TouristObjects { get; set; } = new List<TouristObject>();
    }
}
