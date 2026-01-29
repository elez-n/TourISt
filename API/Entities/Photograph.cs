namespace API.Entities
{
    public class Photograph
    {
        public int Id { get; set; }            
        public string Url { get; set; } = null!;    
        public string? Description { get; set; }   
        public int TouristObjectId { get; set; }        
        public TouristObject Object { get; set; } = null!;
    }
}
