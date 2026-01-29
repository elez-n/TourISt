using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace API.DTOs
{
    public class TouristObjectCreateDto
    {
        public string Name { get; set; } = null!;
        public int ObjectTypeId { get; set; }
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
        public int MunicipalityId { get; set; }
        public List<int> AdditionalServiceIds { get; set; } = new List<int>();
        public List<IFormFile> Photographs { get; set; } = new List<IFormFile>();
    }
}
