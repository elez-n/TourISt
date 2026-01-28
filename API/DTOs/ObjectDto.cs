using System.Collections.Generic;

namespace API.DTOs
{
    public class ObjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        // ObjectType info
        public string ObjectTypeName { get; set; } = null!;

        public bool Status { get; set; } 
        public string Address { get; set; } = null!;
        public double Coordinate1 { get; set; }
        public double Coordinate2 { get; set; }
        public string ContactPhone { get; set; } = null!;
        public string ContactEmail { get; set; } = null!;
        public int NumberOfUnits { get; set; }
        public int NumberOfBeds { get; set; }
        public string Description { get; set; } = null!;
        public string Owner { get; set; } = null!;
        public bool Featured { get; set; }

        // Category info
        public string CategoryName { get; set; } = null!;

        // Municipality info
        public string MunicipalityName { get; set; } = null!;

        // List of additional services
        public List<string> AdditionalServices { get; set; } = new();

        // List of photographs (URLs)
        public List<PhotographDto> Photographs { get; set; } = new();

        // Optionally: average rating or number of reviews
        //public double AverageRating { get; set; }
        //public int ReviewCount { get; set; }
    }
}
