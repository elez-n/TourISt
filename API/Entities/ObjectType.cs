using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using API.Entities;

namespace Api.Entities
{
    [Table("ObjectType")]
    public class ObjectType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = null!;

        // Navigacijska svojstva
        public ICollection<TouristObject>? TouristObjects { get; set; }
    }
}
