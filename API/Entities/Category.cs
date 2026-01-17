namespace API.Entities
{
    public class Category
    {
        public int Id { get; set; }                 
        public string Name { get; set; } = null!;  
        public int MinPoints { get; set; }          
        public int MaxPoints { get; set; }          

        // Veza sa objektima
        public ICollection<TouristObject>? TouristObjects { get; set; }
    }
}
