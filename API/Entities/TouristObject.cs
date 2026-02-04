using System.Collections.Generic;
using Api.Entities;

namespace API.Entities
{
    public class TouristObject
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int ObjectTypeId { get; set; }
        public ObjectType ObjectType { get; set; } = null!;
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
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public int MunicipalityId { get; set; }
        public Municipality Municipality { get; set; } = null!;
        public ICollection<AdditionalService> AdditionalServices { get; set; } = new List<AdditionalService>();
        public ICollection<Photograph> Photographs { get; set; } = new List<Photograph>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public double AverageRating { get; set; }
        public int ReviewCount { get; set; }

    }
}
