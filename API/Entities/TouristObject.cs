using System.Collections.Generic;
using Api.Entities;

namespace API.Entities
{
    public class TouristObject
    {
        public int Id { get; set; } // ID

        public string Name { get; set; } = null!; // Naziv

        // FK prema ObjectType
        public int ObjectTypeId { get; set; }
        public ObjectType ObjectType { get; set; } = null!; // Vrsta

        public bool Status { get; set; }  // Status
        public string Address { get; set; } = null!; // Adresa
        public double Coordinate1 { get; set; } // Koordinata1
        public double Coordinate2 { get; set; } // Koordinata2
        public string ContactPhone { get; set; } = null!; // Kontakt telefon
        public string ContactEmail { get; set; } = null!; // Kontakt mejl
        public int NumberOfUnits { get; set; } // Broj smještajnih jedinica
        public int NumberOfBeds { get; set; } // Broj ležajeva
        public string Description { get; set; } = null!; // Opis
        public string Owner { get; set; } = null!; // Vlasnik
        public bool Featured { get; set; } // Izdvojen

        // FK prema Category
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        // FK prema Municipality
        public int MunicipalityId { get; set; }
        public Municipality Municipality { get; set; } = null!;

        // M:N veza prema AdditionalServices (implicit join table)
        public ICollection<AdditionalService> AdditionalServices { get; set; } = new List<AdditionalService>();

        // 1:N veza prema Photographs
        public ICollection<Photograph> Photographs { get; set; } = new List<Photograph>();

        // 1:N veza prema Reviews (Recenzije)
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
