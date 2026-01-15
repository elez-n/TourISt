using Microsoft.EntityFrameworkCore;

namespace Dipl.Api.Data
{
    public class TouristDbContext : DbContext
    {
        public TouristDbContext(DbContextOptions<TouristDbContext> options)
            : base(options)
    {}
    public DbSet<TouristObject> TouristObjects { get; set; } = null!;
    }
}
