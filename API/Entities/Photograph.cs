namespace API.Entities
{
    public class Photograph
    {
        public int Id { get; set; }                   // Primarni ključ
        public string Url { get; set; } = null!;     // Putanja ili URL slike
        public string? Description { get; set; }     // Opcionalni opis slike

        // Veza sa objektom
        public int TouristObjectId { get; set; }            // FK na Object
        public TouristObject Object { get; set; } = null!;
    }
}
