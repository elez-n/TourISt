namespace API.Entities
{
    public class Review
    {
        public int Id { get; set; }                     // Primarni ključ
        public string Description { get; set; } = null!; // Opis recenzije
        public int Rating { get; set; }                // Ocjena (1-5)

        // Veza sa objektom
        public int TouristObjectId { get; set; }              // FK na Object
        public TouristObject TouristObject { get; set; } = null!;
    }
}
