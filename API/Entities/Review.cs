namespace API.Entities
{
    public class Review
    {
        public int Id { get; set; }               
        public string Description { get; set; } = null!;
        public int Rating { get; set; }             
        public int TouristObjectId { get; set; }          
        public TouristObject TouristObject { get; set; } = null!;
    }
}
